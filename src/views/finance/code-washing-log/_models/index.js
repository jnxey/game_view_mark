import { $t } from '@/lang/i18n';

export const getCodeWashingTempReceipts = (list) => {
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
<div class="receipt-page" style="width: 72mm;padding: 6mm 0;">
  <!-- 店铺信息 -->
  <div style="margin-bottom: 3mm;">
    <h2 style="text-align: center;">${options.web_name ?? ''}${$t('finance.code_washing_log.print_title')}</h2>
    <p style="text-align: center;font-size: 4mm;">${$t('finance.code_washing_log.print_date')}${options.start_time ?? ''}-${options.end_time ?? ''}</p>
  </div>
  <!-- 商品表格 -->
  <div class="border-split">
    <table>
      <tbody>
      <tr>
        <td>${$t('finance.code_washing_log.print_account')}</td>
        <td>${options.username ?? ''}</td>
      </tr>
      <tr>
        <td>${$t('finance.code_washing_log.print_name')}</td>
        <td>${options.nickname ?? ''}</td>
      </tr>
      <tr>
        <td>${$t('finance.code_washing_log.print_total_code_washing')}</td>
        <td>${options.unsettle_code_washing ?? ''}</td>
      </tr>
      <tr>
        <td>${$t('finance.code_washing_log.print_total_code_washing_fee')}</td>
        <td>${options.settle_amount ?? ''}</td>
      </tr>
      <tr>
         <td>${$t('finance.code_washing_log.balance_code_washing_fee')}</td>
        <td>${options.after_balance_code_washing_fee ?? ''}</td>
      </tr>
      <tr>
        <td>${$t('finance.code_washing_log.print_actual_amount')}</td>
        <td>${options.actual_settle_amount ?? ''}</td>
      </tr>
    </table>
    <div class="border-split">
      <!-- 底部信息 -->
      <div style="text-align: center;padding-top: 3mm;">
        ${$t('finance.code_washing_log.print_welcome')}
      </div>
    </div>
  </div>
</div>
    `;
  });
  str = str + '</body></html>';
  return str;
};
