import { reportUserIncomeSettlerLog, reportUserLists } from '@/api/report/user';
import { reportTableLists } from '@/api/report/table';
import { reportDayLists } from '@/api/report/day';
import { reportMonthLists } from '@/api/report/month';
import { reportCheckIncDecLog, reportGameCheckList, reportGameCloseList } from '@/api/report/game-check';
import { betActionLog, betBonusList, betLists } from '@/api/game-data/bet';
import { betOpenLists, betOpenLog } from '@/api/game-data/bet-open';
import { $t } from '@/lang/i18n';

const compose = (list) => list.join(',');

export const DATA_PAGE_LIST = [
  { name: $t('perms.data.page_all'), value: 'all' },
  { name: $t('perms.data.page_user_report'), value: compose([reportUserLists.perm, reportUserIncomeSettlerLog.perm]) },
  { name: $t('perms.data.page_table_report'), value: compose([reportTableLists.perm]) },
  { name: $t('perms.data.page_day_report'), value: compose([reportDayLists.perm]) },
  { name: $t('perms.data.page_month_report'), value: compose([reportMonthLists.perm]) },
  { name: $t('perms.data.page_check_report'), value: compose([reportGameCheckList.perm, reportCheckIncDecLog.perm]) },
  { name: $t('perms.data.page_close_report'), value: compose([reportGameCloseList.perm]) },
  { name: $t('perms.data.page_bet_record'), value: compose([betLists.perm, betActionLog.perm, betBonusList.perm]) },
  { name: $t('perms.data.page_bet_result'), value: compose([betOpenLists.perm, betOpenLog.perm]) }
];
