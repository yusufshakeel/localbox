import {WEBSITE_THEME_LIGHT} from '@/constants';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {useAppContext} from '@/context/AppContext';

export default function ToggleThemeComponent() {
  const {theme, toggleTheme} = useAppContext();
  return (
    <span onClick={toggleTheme} style={{cursor: 'pointer'}}>
      {
        theme === WEBSITE_THEME_LIGHT
          ? <span><FontAwesomeIcon icon={faSun}/> light</span>
          : <span><FontAwesomeIcon icon={faMoon}/> dark</span>
      }
    </span>
  );
}