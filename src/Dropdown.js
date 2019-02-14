import classNames from 'classnames';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { elementType } from 'prop-types-extra';
import BaseDropdown from 'react-overlays/Dropdown';
import useUncontrolled from 'uncontrollable/hook';
import useEventCallback from '@restart/hooks/useEventCallback';

import { useBootstrapPrefix } from './ThemeProvider';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import DropdownItem from './DropdownItem';
import SelectableContext from './SelectableContext';
import createWithBsPrefix from './utils/createWithBsPrefix';

const propTypes = {
  /** @default 'dropdown' */
  bsPrefix: PropTypes.string,
  /**
   * Determines the direction and location of the Menu in relation to it's Toggle.
   */
  drop: PropTypes.oneOf(['up', 'left', 'right', 'down']),

  as: elementType,

  /**
   * Align the menu to the right side of the Dropdown toggle
   */
  alignRight: PropTypes.bool,

  /**
   * Whether or not the Dropdown is visible.
   *
   * @controllable onToggle
   */
  show: PropTypes.bool,

  /**
   * Allow Dropdown to flip in case of an overlapping on the reference element. For more information refer to
   * Popper.js's flip [docs](https://popper.js.org/popper-documentation.html#modifiers..flip.enabled).
   *
   */
  flip: PropTypes.bool,

  /**
   * A callback fired when the Dropdown wishes to change visibility. Called with the requested
   * `show` value, the DOM event, and the source that fired it: `'click'`,`'keydown'`,`'rootClose'`, or `'select'`.
   *
   * ```js
   * function(
   *   isOpen: boolean,
   *   event: SyntheticEvent,
   *   metadata: {
   *     source: 'select' | 'click' | 'rootClose' | 'keydown'
   *   }
   * ): void
   * ```
   *
   * @controllable show
   */
  onToggle: PropTypes.func,

  /**
   * A callback fired when a menu item is selected.
   *
   * ```js
   * (eventKey: any, event: Object) => any
   * ```
   */
  onSelect: PropTypes.func,

  /** @private */
  navbar: PropTypes.bool,
};

const defaultProps = {
  as: 'div',
  navbar: false,
};

const Dropdown = React.forwardRef((uncontrolledProps, ref) => {
  const {
    bsPrefix,
    drop,
    show,
    className,
    alignRight,
    onSelect,
    onToggle,
    as: Component,
    navbar: _4,
    ...props
  } = useUncontrolled(uncontrolledProps, { show: 'onToggle' });

  const onSelectCtx = useContext(SelectableContext);
  const prefix = useBootstrapPrefix(bsPrefix, 'dropdown');

  const handleToggle = useEventCallback(
    (nextShow, event, source = event.type) => {
      if (event.currentTarget === document) source = 'rootClose';
      onToggle(nextShow, event, { source });
    },
  );

  const handleSelect = useEventCallback((key, event) => {
    if (onSelectCtx) onSelectCtx(key, event);
    if (onSelect) onSelect(key, event);
    handleToggle(false, event, 'select');
  });

  return (
    <SelectableContext.Provider value={handleSelect}>
      <BaseDropdown.ControlledComponent
        drop={drop}
        show={show}
        alignEnd={alignRight}
        onToggle={handleToggle}
        itemSelector={`.${prefix}-item:not(.disabled):not(:disabled)`}
      >
        {({ props: dropdownProps }) => (
          <Component
            {...props}
            {...dropdownProps}
            ref={ref}
            className={classNames(
              className,
              show && 'show',
              (!drop || drop === 'down') && prefix,
              drop === 'up' && 'dropup',
              drop === 'right' && 'dropright',
              drop === 'left' && 'dropleft',
            )}
          />
        )}
      </BaseDropdown.ControlledComponent>
    </SelectableContext.Provider>
  );
});

Dropdown.displayName = 'Dropdown';
Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;

Dropdown.Header = createWithBsPrefix('dropdown-header', {
  defaultProps: { role: 'heading' },
});
Dropdown.Divider = createWithBsPrefix('dropdown-divider', {
  defaultProps: { role: 'separator' },
});

export default Dropdown;
