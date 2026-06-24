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
const ANALYTICS_KEY = 'analytics_events';

const getEvents = () => {
  try { return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]'); } catch { return []; }
};

export const trackPageView = (path) => {
  const events = getEvents();
  events.push({ type: 'pageview', path, ts: new Date().toISOString() });
  if (events.length > 500) events.splice(0, events.length - 500);
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
};

export const getAnalytics = () => {
  const events = getEvents();
  const pageViews = events.filter(e => e.type === 'pageview');
  const uniquePaths = new Set(pageViews.map(e => e.path));
  return {
    totalPageViews: pageViews.length,
    uniquePages: uniquePaths.size,
    pages: [...uniquePaths].map(path => ({
      path,
      views: pageViews.filter(e => e.path === path).length,
    })),
  };
};
