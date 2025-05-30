/**
 * App configuration update for Yunnan Taste Mini-Program
 * Adds validation pages to the app configuration
 */

export default {
  pages: [
    'pages/home/index',
    'pages/category/index',
    'pages/search/index',
    'pages/user/index',
    'pages/product/detail',
    'pages/validation/theme-consistency',
    'pages/validation/data-flow',
    'pages/validation/backend-integration'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0A0F1E',
    navigationBarTitleText: '云南味道',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    custom: true,
    color: '#8A8F9C',
    selectedColor: '#5CE0B8',
    backgroundColor: '#0A0F1E',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
        iconPath: 'assets/icons/category.png',
        selectedIconPath: 'assets/icons/category-active.png'
      },
      {
        pagePath: 'pages/search/index',
        text: '搜索',
        iconPath: 'assets/icons/search.png',
        selectedIconPath: 'assets/icons/search-active.png'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: 'assets/icons/user.png',
        selectedIconPath: 'assets/icons/user-active.png'
      }
    ]
  }
}
