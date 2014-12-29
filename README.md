autocompleterap
==================

Gets raps for pairs of things as suggested by Google autocomplete.

Installation
------------

    Clone this repo.

    Then, create a `config.js` file in the project root that contains your [Twitter API keys](https://apps.twitter.com/) and your [Wordnik API key](http://developer.wordnik.com/). Example:

        module.exports = {
          twitter: {
            consumer_key: 'asdfkljqwerjasdfalpsdfjas',
            consumer_secret: 'asdfasdjfbkjqwhbefubvskjhfbgasdjfhgaksjdhfgaksdxvc',
            access_token: '9999999999-zxcvkljhpoiuqwerkjhmnb,mnzxcvasdklfhwer',
            access_token_secret: 'opoijkljsadfbzxcnvkmokwertlknfgmoskdfgossodrh'
          },
          wordnikAPIKey: 'mkomniojnnuibiybvuytvutrctrxezewarewetxyfcftvuhbg'
        };

Usage
-----

    make run

Tests
-----

Run tests with `make test`.

License
-------

MIT.
