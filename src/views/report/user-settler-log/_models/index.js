import { $t } from '@/lang/i18n';

export const getReportUserProfitTempReceipts = (list) => {
  let str = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style type="text/css">
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-size: 5mm;
      line-height: 1.5;
      font-family: 'Courier New', monospace;
    }

    /* 表格样式 */
    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 2mm 1mm; /* 增加单元格内边距 */
      text-align: left;
      vertical-align: top;
    }

    @media print {
       .receipt-page {
         page-break-after: always; /* 每个小票后强制分页 */
       }
    }

    .border-split {
      border-top: 2mm double black;
    }
  </style>
</head>
<body>
  `;
  list.forEach((options) => {
    str =
      str +
      `
<div class="receipt-page" style="width: 72mm;height: 210mm;padding: 6mm 0;">
  <!-- 店铺信息 -->
  <div style="margin-bottom: 3mm;">
    <h2 style="text-align: center;">${options.web_name ?? ''}${$t('report.user_settler_log.title_print')}</h2>
    <p style="text-align: center;font-size: 4mm;">${$t('report.user_settler_log.date')}${options.start_time ?? ''}-${options.end_time ?? ''}</p>
  </div>
  <!-- 商品表格 -->
  <div class="border-split">
    <table>
      <tr>
        <td>${$t('common.user_no')}</td>
        <td>${options.username ?? ''}</td>
      </tr>
      <tr>
        <td>${$t('report.user_settler_log.total_amount')}</td>
        <td>${options.total_amount ?? ''}</td>
      </tr>
      <tr>
        <td>${$t('report.user_settler_log.total_bet_profit_loss')}</td>
        <td>${options.total_bet_profit_loss ?? ''}</td>
      </tr>
      <tr>
        <td>${$t('report.user_settler_log.total_code_washing')}</td>
        <td>${options.total_code_washing ?? ''}</td>
      </tr>
      <tr>
        <td>${$t('report.user_settler_log.total_code_washing_fee')}</td>
        <td>${options.total_code_washing_fee ?? ''}</td>
      </tr>
      <tr>
        <td>${$t('report.user_settler_log.total_user_profit_loss_print')}</td>
        <td>${options.total_user_profit_loss ?? ''}</td>
      </tr>
    </table>
    <div class="border-split">
      <table style="margin-bottom: 3mm;">
        <tr>
          <td>${$t('report.user_settler_log.sign')}：</td>
          <td>${$t('report.user_settler_log.sign')}:</td>
        </tr>
      </table>
    </div>
    <!-- 底部信息 -->
    <div style="text-align: center;padding-top: 3mm;">
      ${$t('report.user_settler_log.tips_print_footer')}
    </div>
  </div>
</div>
    `;
  });
  str = str + '</body></html>';
  return str;
};
