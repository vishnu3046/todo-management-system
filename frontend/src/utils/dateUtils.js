/**
 * Format ISO or YYYY-MM-DD date string into human-readable date
 * e.g., "2026-10-18" -> "Oct 18, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return 'No due date';
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, parseInt(month, 10) - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Get intelligent due date relative description & status tone
 */
export function getDueStatus(dateString, status) {
  if (!dateString) {
    return { label: 'No deadline', tone: 'neutral' };
  }

  if (status === 'Completed') {
    return { label: `Completed • ${formatDate(dateString)}`, tone: 'success' };
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      label: `Overdue by ${daysAgo} day${daysAgo === 1 ? '' : 's'}`,
      tone: 'danger',
      isOverdue: true,
    };
  } else if (diffDays === 0) {
    return { label: 'Due today', tone: 'warning', isToday: true };
  } else if (diffDays === 1) {
    return { label: 'Due tomorrow', tone: 'warning' };
  } else if (diffDays <= 7) {
    return { label: `Due in ${diffDays} days`, tone: 'info' };
  } else {
    return { label: formatDate(dateString), tone: 'neutral' };
  }
}
