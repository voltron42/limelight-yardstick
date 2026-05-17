/**
 * Namespace: limelight.Main
 * Purpose: Main app component (stateful)
 */

namespace('limelight.Main', {
  'limelight.utils.ApiService': 'ApiService',
}, ({ ApiService }) => {

  return class Main extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {
      return <div></div>;
    }
  };
});
