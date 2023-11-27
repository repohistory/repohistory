const options = {
  responsive: true,
  plugins: {
    tooltip: {
      boxPadding: 2,
      usePointStyle: true,
      callbacks: {
        labelColor(ctx: any) {
          return {
            borderColor: ctx.dataset.backgroundColor,
            backgroundColor: ctx.dataset.backgroundColor,
            borderWidth: 3,
          };
        },
      },
    },
    legend: {
      display: false,
    },
  },
};

const scales = {
  x: {
    grid: {
      color: '#00000000',
    },
    ticks: {
      maxTicksLimit: 5,
    },
  },
  y: {
    grid: {
      color: '#202225',
    },
  },
};

export const barOptions = {
  ...options,
  scales: {
    ...scales,
    x: {
      ...scales.x,
      stacked: true,
    },
  },
};

export const lineOptions = {
  ...options,
  scales,
};

export const doughnutOptions = {
  ...options,
  cutout: '60%',
};
