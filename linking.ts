const config = {
  screens: {
    HomeScreen: '*',
  },
};

const linking: any = {
  prefixes: ['todoapp://app', 'todoapp'],
  config,
};

export default linking;
