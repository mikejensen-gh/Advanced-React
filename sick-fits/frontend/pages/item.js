import PropTypes from 'prop-types';
import SingleItem from '../components/SingleItem';

const Item = props => {
  const {
    query: { id },
  } = props;

  return <SingleItem id={id} />;
};

Item.propTypes = {
  query: PropTypes.object.isRequired,
};

export default Item;
