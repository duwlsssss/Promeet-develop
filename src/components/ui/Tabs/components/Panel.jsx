import { PanelContainer } from '../style';
import PropTypes from 'prop-types';
import useTabsStore from '@/stores/ui/useTabsStore';

/**
 * Panel 컴포넌트
 *
 * @param {string} value - 패널의 값
 * @param {node} children - 패널의 구성 요소
 */
const Panel = ({ value, children }) => {
  const { selectedValue, option } = useTabsStore();

  if (value !== selectedValue) return;

  return (
    <PanelContainer
      id={`${option}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${option}-trigger-${value}`}
    >
      {children}
    </PanelContainer>
  );
};

Panel.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Panel;
