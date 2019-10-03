import React, { PureComponent } from 'react';
import { TouchableOpacity, SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';

// Services and Actions
import { updateActiveBottomTab } from '../../../redux/actions/uiAction';

// Constants
import ROUTES from '../../../constants/routeNames';

// Components

// Styles
import styles from './bottomTabBarStyles';

class BottomTabBarView extends PureComponent {
  /* Props
   * ------------------------------------------------
   *   @prop { type }    name                - Description....
   */

  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycles
  UNSAFE_componentWillUpdate(nextProps) {
    const {
      navigation: {
        state: { index, routes },
      },
      dispatch,
    } = nextProps;

    dispatch(updateActiveBottomTab(routes[index].routeName));
  }

  // Component Functions
  _jumpTo = route => {
    const {
      jumpTo,
      navigation: {
        state: { index, routes },
      },
    } = this.props;

    const _routeName = routes[index].routeName;

    if (
      !!route &&
      !!route.params &&
      !!route.params.scrollToTop &&
      _routeName === ROUTES.TABBAR.HOME
    ) {
      route.params.scrollToTop();
    }

    jumpTo(route.key);
  };

  render() {
    const {
      navigation: {
        state: { index, routes },
      },
      activeTintColor,
      inactiveTintColor,
      renderIcon,
    } = this.props;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wrapper}>
          {routes.map((route, idx) => (
            <View
              key={route.key}
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <TouchableOpacity onPress={() => this._jumpTo(route)}>
                {renderIcon({
                  route,
                  focused: index === idx,
                  tintColor: index === idx ? activeTintColor : inactiveTintColor,
                })}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }
}

export default connect()(BottomTabBarView);
