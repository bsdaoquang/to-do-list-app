const config = {
  screens: {
    Router: {
      path: 'home',
      screens: {
        HomeScreen: {},
      },
    },
    TaskDetail: {
      path: 'task-detail/:id',
    },
  },
};

const linking: any = {
  prefixes: ['todoapp://app'],
  config,
};

export default linking;
