// src/data/themeOptions.ts
import bgLight from '../assets/images/bg-light.png';
import bgDark from '../assets/images/bg-dark.png';
import layoutVertical from '../assets/images/layou-vertical.png';
import layoutHorizontal from '../assets/images/layout-horizontal.png'
import bgAutre from '../assets/images/bg-autre.png'
export const layoutOptions = [
    { id: 'vertical', label: 'Vertical', image: layoutVertical },
    { id: 'horizontal', label: 'Horizontal', image: layoutHorizontal },
  ];
  
  export const colorSchemeOptions = [
    { id: 'light', label: 'Light', image: bgLight},
    { id: 'dark', label: 'Dark', image: bgDark },
    { id: 'autre', label: 'Autre', image: bgAutre },
  ];
  
  