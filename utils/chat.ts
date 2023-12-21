import { ChatSession } from '@/types';
import _ from 'lodash';
import moment from 'moment';

type TimeGroupedSessions = Record<string, ChatSession[]>;

// Function to categorize and sort sessions
export const categorizeAndSortSessions = (
  sessions: ChatSession[]
): TimeGroupedSessions => {
  const groupedSessions = sessions.reduce((acc, session) => {
    const updatedAt = moment(session.updatedAt);
    let groupKey;

    if (updatedAt.isSame(moment(), 'day')) {
      groupKey = 'Today';
    } else if (updatedAt.isSame(moment().subtract(1, 'days'), 'day')) {
      groupKey = 'Yesterday';
    } else if (updatedAt.isSame(moment(), 'month')) {
      groupKey = 'This Month';
    } else if (updatedAt.isSame(moment(), 'year')) {
      groupKey = updatedAt.format('MMMM');
    } else {
      groupKey = updatedAt.format('YYYY');
    }

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(session);
    return acc;
  }, {} as TimeGroupedSessions);

  // Sort each group by createdAt date
  Object.keys(groupedSessions).forEach((group) => {
    groupedSessions[group] = _.orderBy(
      groupedSessions[group],
      ['updatedAt'],
      ['desc']
    );
  });

  // Get sorted group keys according to custom sort function
  const sortedGroupsKeys = Object.keys(groupedSessions).sort(sortTimeGroups);

  // Create sorted groups based on sorted keys
  const sortedGroups = sortedGroupsKeys.reduce((acc, key) => {
    acc[key] = groupedSessions[key];
    return acc;
  }, {} as TimeGroupedSessions);

  return sortedGroups;
};

const sortTimeGroups = (a: string, b: string): number => {
  const order = ['Today', 'Yesterday', 'This Month'];
  const months = moment.months(); // Array of months from January to December

  // If both keys are in our predefined order, use that order
  if (order.includes(a) && order.includes(b)) {
    return order.indexOf(a) - order.indexOf(b);
  }

  // If one of the keys is a month of the current year, it should come after our predefined order
  if (months.includes(a) && months.includes(b)) {
    return months.indexOf(a) - months.indexOf(b);
  }

  if (order.includes(a)) {
    return -1;
  }
  if (order.includes(b)) {
    return 1;
  }

  // If both keys are years, sort them as numbers
  if (!isNaN(Number(a)) && !isNaN(Number(b))) {
    return Number(b) - Number(a); // Descending order for years
  }

  return 0;
};
