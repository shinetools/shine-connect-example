import PropTypes from 'prop-types';

function Emoji({ name, emoji }) {
  return (
    <span role="img" aria-label={name}>
      {emoji}
    </span>
  );
}

Emoji.propTypes = {
  name: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired,
};

export default Emoji;
