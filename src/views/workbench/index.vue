<template>
  <div class="dashboard-container">
    <!-- 数据卡片 -->
    <el-row :gutter="20" class="stats-grid">
      <el-col :lg="4" :span="12">
        <div class="stat-card mb-16">
          <h3>{{ $t('workbench.total_employees') }}</h3>
          <div class="value">{{ totalEmployees }}</div>
          <gv-icon name="local-icon-dashboard-worker" class="card-icon" />
        </div>
      </el-col>
      <el-col :lg="5" :span="12">
        <div class="stat-card mb-16">
          <h3>{{ $t('workbench.total_members') }}</h3>
          <div class="value">{{ totalMembers }}</div>
          <gv-icon name="local-icon-dashboard-user" class="card-icon" />
        </div>
      </el-col>
      <el-col :lg="5" :span="12">
        <div class="stat-card mb-16">
          <h3>{{ $t('workbench.daily_active') }}</h3>
          <div class="value">{{ dailyActive }}</div>
          <gv-icon name="local-icon-dashboard-active-user" class="card-icon" />
        </div>
      </el-col>
      <el-col :lg="5" :span="12">
        <div class="stat-card mb-16">
          <h3>{{ $t('workbench.monthly_active') }}</h3>
          <div class="value">{{ monthlyActive }}</div>
          <gv-icon name="local-icon-dashboard-active-user" class="card-icon" />
        </div>
      </el-col>
      <el-col :lg="5" :span="12">
        <div class="stat-card mb-16">
          <h3>{{ $t('workbench.new_members') }}</h3>
          <div class="value">{{ newMembers }}</div>
          <gv-icon name="local-icon-dashboard-add-user" class="card-icon" />
        </div>
      </el-col>
    </el-row>

    <!--  快捷菜单  -->
    <div class="quick-menu-container">
      <div class="quick-box mb-16">
        <h3 class="mb-16">{{ $t('workbench.quick_menu') }}</h3>
        <div class="flex-row align-center flex-wrap">
          <quick-btn class="mr-16" :name="$t('menu.page.user_lists')" icon="local-icon-user_guanli" :perm="permsMap.user.list.view" />
          <quick-btn
            class="mr-16"
            :name="$t('menu.page.material_material')"
            icon="local-icon-shangchuanzhaopian"
            :perm="permsMap.material.center.view"
          />
          <quick-btn class="mr-16" :name="$t('menu.page.org_department')" icon="el-icon-Coordinate" :perm="permsMap.org.department.view" />
          <quick-btn class="mr-16" :name="$t('menu.page.game_list')" icon="local-icon-list-2" :perm="permsMap.game.list.view" />
          <quick-btn class="mr-16" :name="$t('menu.page.game_data_bet_open')" icon="local-icon-bet-open" :perm="permsMap.game_data.bet_open.view" />
          <quick-btn class="mr-16" :name="$t('menu.page.report_user')" icon="local-icon-report-user" :perm="permsMap.report.user.view" />
          <quick-btn class="mr-16" :name="$t('menu.page.currency_config')" icon="local-icon-currency-config" :perm="permsMap.currency.config.view" />
          <quick-btn class="mr-16" :name="$t('menu.page.finance_table')" icon="local-icon-table" :perm="permsMap.finance.table.view" />
          <quick-btn class="mr-16" :name="$t('menu.page.points_summary')" icon="local-icon-points-member" :perm="permsMap.point.summary.view" />
          <quick-btn class="mr-16" :name="$t('menu.page.external_costs')" icon="local-icon-fee" :perm="permsMap.external.costs.view" />
          <quick-btn class="mr-16" :name="$t('menu.page.goods_stock')" icon="local-icon-stock" :perm="permsMap.goods.stock.view" />
          <quick-btn class="mr-16" :name="$t('menu.page.staff_admin')" icon="local-icon-shouyiren" :perm="permsMap.staff.admin.view" />
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <el-row :gutter="20" class="stats-grid">
        <el-col :lg="14" :span="24">
          <div class="chart-box mb-16">
            <h3>{{ $t('workbench.qoq_options_current') }}</h3>
            <gv-chart v-if="qoqOptionsCurrent" :options="qoqOptionsCurrent" class="chart" />
          </div>
        </el-col>
        <el-col :lg="10" :span="24">
          <div class="chart-box mb-16">
            <h3>{{ $t('workbench.pipe_options') }}</h3>
            <gv-chart v-if="pipeOptions" :options="pipeOptions" class="chart" />
          </div>
        </el-col>
        <el-col :lg="14" :span="24">
          <div class="chart-box mb-16">
            <h3>{{ $t('workbench.daily_options') }}</h3>
            <gv-chart v-if="dailyOptions" :options="dailyOptions" class="chart" />
          </div>
        </el-col>
        <el-col :lg="10" :span="24">
          <div class="chart-box mb-16">
            <h3>{{ $t('workbench.monthly_options') }}</h3>
            <gv-chart v-if="monthlyOptions" :options="monthlyOptions" class="chart" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onBeforeMount } from 'vue';
import { getWorkbench } from '@/api/common';
import GvChart from '@/components/gv-chart/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import QuickBtn from '@/views/workbench/_components/quick-btn.vue';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

// 模拟数据
const totalEmployees = ref();
const totalMembers = ref();
const dailyActive = ref();
const monthlyActive = ref();
const newMembers = ref();
const dailyStats = shallowRef([]);
const monthlyStats = shallowRef([]);
const pipeStats = shallowRef([]);
const qoqStats = shallowRef([]);
const dailyOptions = shallowRef();
const monthlyOptions = shallowRef();
const pipeOptions = shallowRef();
const qoqOptionsCurrent = shallowRef();

// 图表配置
const initChart = (title, data) => {
  return {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.dates },
    yAxis: { type: 'value' },
    series: [{ data: data.values, type: 'line', smooth: true, lineStyle: { width: 2 } }]
  };
};

// 图表配置
const initQoqChart = (title, data1, data2) => {
  const x0 = { xAxisIndex: 0, yAxisIndex: 0 };
  const x1 = { xAxisIndex: 1, yAxisIndex: 1 };
  return {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: [
      { type: 'category', data: data1.dates, gridIndex: 0 },
      { type: 'category', data: data2.dates, gridIndex: 1 }
    ],
    yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
    grid: [{ bottom: '55%' }, { top: '55%' }],
    legend: {
      data: [
        $t('workbench.total_amount'),
        $t('workbench.total_profit'),
        $t('workbench.total_bet_profit'),
        $t('workbench.total_code_washing'),
        $t('workbench.total_code_washing_fee'),
        $t('workbench.total_bonus_profit'),
        $t('workbench.total_active')
      ]
    },
    series: [
      { name: $t('workbench.total_amount'), data: data1.sum_amount, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x0 },
      { name: $t('workbench.total_profit'), data: data1.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x0 },
      { name: $t('workbench.total_bet_profit'), data: data1.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x0 },
      { name: $t('workbench.total_code_washing'), data: data1.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x0 },
      {
        name: $t('workbench.total_code_washing_fee'),
        data: data1.sum_net_earning,
        type: 'bar',
        barGap: 0,
        smooth: true,
        lineStyle: { width: 2 },
        ...x0
      },
      { name: $t('workbench.total_bonus_profit'), data: data1.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x0 },
      { name: $t('workbench.total_active'), data: data1.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x0 },
      //
      { name: $t('workbench.total_amount'), data: data2.sum_amount, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x1 },
      { name: $t('workbench.total_profit'), data: data2.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x1 },
      { name: $t('workbench.total_bet_profit'), data: data2.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x1 },
      { name: $t('workbench.total_code_washing'), data: data2.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x1 },
      {
        name: $t('workbench.total_code_washing_fee'),
        data: data2.sum_net_earning,
        type: 'bar',
        barGap: 0,
        smooth: true,
        lineStyle: { width: 2 },
        ...x1
      },
      { name: $t('workbench.total_bonus_profit'), data: data2.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x1 },
      { name: $t('workbench.total_active'), data: data2.sum_net_earning, type: 'bar', barGap: 0, smooth: true, lineStyle: { width: 2 }, ...x1 }
    ]
  };
};

// 图表配置
const initPipe = (title, data) => {
  return {
    title: { text: title, left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { top: '2%', left: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 40, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: data
      }
    ]
  };
};

const getDashboardData = async () => {
  const res = await getWorkbench();
  totalEmployees.value = res.totalStaff;
  totalMembers.value = res.totalUser;
  dailyActive.value = res.totalTodayActiveUser;
  monthlyActive.value = res.totalMonthActiveUser;
  newMembers.value = res.totalMonthNewUser;
  dailyStats.value = res.dailyStats ?? [];
  monthlyStats.value = res.monthlyStats ?? [];
  pipeStats.value = res.monthPieChart ?? [];
  qoqStats.value = res.monthQoq ?? { current: [], qoq: [] };
  // 每日活跃数据
  dailyOptions.value = initChart('', {
    dates: dailyStats.value.map((val) => val.data_day),
    values: dailyStats.value.map((val) => val.user_count)
  });

  // 每月活跃数据
  monthlyOptions.value = initChart('', {
    dates: monthlyStats.value.map((val) => val.data_month),
    values: monthlyStats.value.map((val) => val.user_count)
  });

  // 投注项饼图
  const pipeData = pipeStats.value.map((item) => ({ value: item.count_game_kind, name: $ti(item.name) }));
  pipeOptions.value = initPipe('', pipeData);

  // 环比
  qoqOptionsCurrent.value = initQoqChart(
    '',
    {
      dates: qoqStats.value.current.map((val) => val.data_day),
      sum_amount: qoqStats.value.current.map((val) => val.sum_amount),
      sum_code_washing: qoqStats.value.current.map((val) => val.sum_code_washing),
      sum_code_washing_fee: qoqStats.value.current.map((val) => val.sum_code_washing_fee),
      sum_bonus_profit_loss: qoqStats.value.current.map((val) => val.sum_bonus_profit_loss),
      sum_net_earning: qoqStats.value.current.map((val) => val.sum_net_earning),
      sum_bet_profit_loss: qoqStats.value.current.map((val) => val.sum_bet_profit_loss),
      user_count: qoqStats.value.current.map((val) => val.user_count)
    },
    {
      dates: qoqStats.value.qoq.map((val) => val.data_day),
      sum_amount: qoqStats.value.qoq.map((val) => val.sum_amount),
      sum_code_washing: qoqStats.value.qoq.map((val) => val.sum_code_washing),
      sum_code_washing_fee: qoqStats.value.qoq.map((val) => val.sum_code_washing_fee),
      sum_bonus_profit_loss: qoqStats.value.qoq.map((val) => val.sum_bonus_profit_loss),
      sum_net_earning: qoqStats.value.qoq.map((val) => val.sum_net_earning),
      sum_bet_profit_loss: qoqStats.value.qoq.map((val) => val.sum_bet_profit_loss),
      user_count: qoqStats.value.qoq.map((val) => val.user_count)
    }
  );
};

onBeforeMount(async () => {
  await getDashboardData();
});
</script>

<style scoped lang="scss">
.stat-card {
  position: relative;
  min-height: 90px;
  padding: 20px;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  border-radius: var(--gv-border-radius-big);
  box-shadow: var(--el-box-shadow-light);
  overflow: hidden;
}

.stat-card h3 {
  position: relative;
  margin: 0 0 10px 0;
  white-space: nowrap;
  word-break: keep-all;
  font-size: 16px;
  z-index: 10;
}

.stat-card .value {
  position: relative;
  font-size: 28px;
  font-weight: bold;
  z-index: 10;
}

.stat-card .card-icon {
  position: absolute;
  bottom: -15px;
  right: -15px;
  font-size: 80px;
  color: var(--el-color-primary-light-9);
  z-index: 0;
}

.quick-box {
  min-height: 60px;
  padding: 20px;
  border-radius: var(--gv-border-radius-big);
  background-color: var(--el-bg-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chart-box {
  min-height: 450px;
  padding: 20px;
  border-radius: var(--gv-border-radius-big);
  background-color: var(--el-bg-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chart {
  height: 400px;
}
</style>
