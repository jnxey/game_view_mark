import { computed, shallowRef } from 'vue';

export function useBetPlayer() {
  // 当前玩家
  const currentPlayer = shallowRef([]);

  // 当前玩家投注统计
  const currentPlayerCount = computed(() => {
    const players = currentPlayer.value ?? [];
    const result = {};
    players.forEach((item) => {
      Object.keys(item.kind_amount).forEach((kindId) => {
        if (Number(item.kind_amount[kindId]) > 0) {
          if (!result[kindId]) result[kindId] = {};
          if (!result[kindId][item.currency_config_id]) result[kindId][item.currency_config_id] = 0;
          result[kindId][item.currency_config_id] = result[kindId][item.currency_config_id] + Number(item.kind_amount[kindId]);
        }
      });
    });
    return result;
  });

  // 设置当前玩家投注信息
  const updateCurrentPlayer = (value) => {
    currentPlayer.value = value;
  };

  return { currentPlayer, currentPlayerCount, updateCurrentPlayer };
}
