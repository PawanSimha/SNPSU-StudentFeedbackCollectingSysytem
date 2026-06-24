/*
  SOAS Feedback Collector - Anonymous course feedback platform for Sapthagiri NPS University
  Copyright (C) 2026 Pawan Simha R

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SOAS Feedback Collector API',
      version: '1.3.0',
      description: 'REST API for authenticated and anonymous course feedback at Sapthagiri NPS University',
      contact: { name: 'Pawan Simha R', url: 'https://github.com/PawanSimha' },
      license: { name: 'GPL-3.0', url: 'https://www.gnu.org/licenses/gpl-3.0.html' },
    },
    servers: [{ url: process.env.CORS_ORIGIN?.replace(/\/+$/, '') || 'http://localhost:5173', description: 'Dev server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Student: {
          type: 'object',
          properties: {
            _id: { type: 'string' }, name: { type: 'string' }, email: { type: 'string' },
            usn: { type: 'string' }, role: { type: 'string', enum: ['student', 'admin'] }, classGroup: { type: 'string' },
          },
        },
        Feedback: {
          type: 'object',
          properties: {
            _id: { type: 'string' }, student: { type: 'string' }, subject: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 }, comments: { type: 'string' }, createdAt: { type: 'string' },
          },
        },
        PublicFeedback: {
          type: 'object',
          properties: {
            _id: { type: 'string' }, subject: { type: 'string' }, facultyName: { type: 'string' },
            comments: { type: 'string' }, createdAt: { type: 'string' },
          },
        },
        Allotment: {
          type: 'object',
          properties: {
            _id: { type: 'string' }, classGroup: { type: 'string' }, isOpen: { type: 'boolean' },
            message: { type: 'string' }, allottedAt: { type: 'string' },
          },
        },
        Error: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
    paths: {
      '/api/auth/login': {
        post: {
          tags: ['Auth'], summary: 'Student/admin login', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'usn', 'password'], properties: { email: { type: 'string' }, usn: { type: 'string' }, password: { type: 'string' } } } } } },
          responses: { 200: { description: 'JWT + user profile' }, 401: { description: 'Invalid credentials' } },
        },
      },
      '/api/auth/me': {
        get: { tags: ['Auth'], summary: 'Get current user', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Student profile' }, 401: { description: 'Unauthorized' } } },
      },
      '/api/feedback/subjects': {
        get: { tags: ['Feedback'], summary: 'List subjects', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Array of subject strings' } } },
      },
      '/api/feedback/my': {
        get: { tags: ['Feedback'], summary: 'My feedback history', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Array of Feedback' } } },
      },
      '/api/feedback/submit': {
        post: {
          tags: ['Feedback'], summary: 'Submit authenticated feedback', security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['subject', 'rating'], properties: { subject: { type: 'string' }, rating: { type: 'integer' }, comments: { type: 'string' } } } } } },
          responses: { 201: { description: 'Created' }, 400: { description: 'Validation error' }, 403: { description: 'Allotment closed' } },
        },
      },
      '/api/allotments/status': {
        get: { tags: ['Allotments'], summary: 'Check open status', security: [{ bearerAuth: [] }], responses: { 200: { description: '{ open, message }' } } },
      },
      '/api/allotments': {
        get: { tags: ['Allotments'], summary: 'List allotments', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Array of Allotment' } } },
        post: {
          tags: ['Allotments'], summary: 'Toggle allotment', security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { classGroup: { type: 'string' }, message: { type: 'string' } } } } } },
          responses: { 200: { description: 'Updated Allotment' } },
        },
      },
      '/api/admin/classes': { get: { tags: ['Admin'], summary: 'List class groups', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Array of class strings' } } } },
      '/api/admin/students': { get: { tags: ['Admin'], summary: 'List students', security: [{ bearerAuth: [] }], parameters: [{ name: 'class', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'Array of Student' } } } },
      '/api/admin/feedback/stats': { get: { tags: ['Admin'], summary: 'Feedback stats', security: [{ bearerAuth: [] }], parameters: [{ name: 'class', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'Statistics object' } } } },
      '/api/admin/db-overview': { get: { tags: ['Admin'], summary: 'Database overview', security: [{ bearerAuth: [] }], responses: { 200: { description: 'All collections' } } } },
      '/api/public/subjects': { get: { tags: ['Public'], summary: 'Public subject list', security: [], responses: { 200: { description: 'Array of subject strings' } } } },
      '/api/public/feedback': {
        post: {
          tags: ['Public'], summary: 'Submit anonymous feedback', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['subject', 'comments'], properties: { subject: { type: 'string' }, facultyName: { type: 'string' }, comments: { type: 'string' } } } } } },
          responses: { 201: { description: 'Created' }, 400: { description: 'Validation error' } },
        },
      },
      '/api/public/feedbacks': { get: { tags: ['Public'], summary: 'List anonymous feedbacks', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Array of PublicFeedback' } } } },
      '/api/health': { get: { tags: ['Health'], summary: 'Health check', security: [], responses: { 200: { description: '{ status: \"ok\" }' } } } },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
