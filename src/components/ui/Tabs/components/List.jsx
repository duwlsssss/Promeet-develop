import { ListContainer } from '../style';
import PropTypes from 'prop-types';
import useTabsStore from '@/stores/ui/useTabsStore';

/**
 * List 컴포넌트
 *
 * @param {node} children - 리스트 구성 요소
 */
const List = ({ children }) => {
  const { option } = useTabsStore();

  return (
    <ListContainer role="tablist" aria-label={option} aria-orientation="horizontal">
      {children}
    </ListContainer>
  );
};

List.propTypes = {
  children: PropTypes.node.isRequired,
};

export default List;
