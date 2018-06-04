import PropTypes from 'prop-types';

const Emoji = ({ name, emoji }) => (
  <span role="img" aria-label={name}>
    {emoji}
  </span>
);

Emoji.propTypes = {
  name: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired,
};

export default Emoji;
