import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const Header = React.memo((props) => {
  const { lang, title, author, description, ogType, twitterCard } = props;
  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {description && <meta name="description" content={props.description} />}
      {ogType && <meta property={`og:title`} content={title} />}
      {ogType && <meta property={`og:type`} content={ogType} />}
      {ogType && description && (
        <meta property={`og:description`} content={description} />
      )}
      {twitterCard && <meta name={`twitter:card`} content={twitterCard} />}
      {twitterCard && <meta name={`twitter:title`} content={title} />}
      {twitterCard && author && (
        <meta name={`twitter:creator`} content={props.author} />
      )}
      {twitterCard && description && (
        <meta name={`twitter:description`} content={props.description} />
      )}
    </Helmet>
  );
});

Header.defaultProps = {
  title: 'Welcome!',
  lang: 'en',
};

Header.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  author: PropTypes.string,
  description: PropTypes.string,
  ogType: PropTypes.string,
  twitterCard: PropTypes.string,
};

export default Header;
