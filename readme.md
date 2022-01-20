# Date-picker
------------
## Script

**yarn dev** - run webpack dev server for development.
**yarn build** - build static file in `./dist`.
**yarn serve** - [serve](https://www.npmjs.com/package/serve) `./dist` on 3000 port
**yarn lint** - check linter.
**yarn lint-fix** - check linter and auto fix if possible

--------------
## API

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| **value** | `Date` | `new Date()` | Represents the selected date by the component. This prop is parsed by Moment.js, so it is possible to use a date `string` or a `moment` object. |
| **initialValue** | `Date` | `new Date()` | Represents the initial selected date for the component to. This prop is parsed by Moment.js, so it is possible to use a date `string` or a `moment` object. If you need to set the selected date programmatically after the picker is initialized, please use the `value` prop instead. |
| **initialPickerDate** | `Date` | `new Date()` | Define the month/year/decade/time which is viewed on opening the calendar. This prop is parsed by Moment.js, so it is possible to use a date `string` or a `moment` object. |
| **initialPickerMode** | `string` or `number` | `'days'` | The default view to display when the picker is shown for the first time (`'years'`, `'months'`, `'days'`, `'time'`). |
| **updateOnView** | `string` | Intelligent guess | By default we can navigate through years and months without actualling updating the selected date. Only when we get to one view called the "updating view", we make a selection there and the value gets updated, triggering an `onChange` event. By default the updating view will get guessed by using the `dateFormat` so if our dates only show months and never days, the update is done in the `months` view. If we set `updateOnView="time"` selecting a day will navigate to the time view. The time view always updates the selected date, never navigates. If `closeOnSelect={ true }`, making a selection in the view defined by `updateOnView` will close the calendar. |
| **dateFormat**   | `boolean` or `string`  | `true` | Defines the format for the date. It accepts any [Moment.js date format](http://momentjs.com/docs/#/displaying/format/) (not in localized format). If `true` the date will be displayed `'YYYY-MM-DD'`. |
| **input** | `boolean` | `true` | Whether to show an input field to edit the date manually. |
| **open** | `boolean` | `null` | Whether to open or close the picker. If not set react-datetime will open the datepicker on input focus and close it on click outside. |
| **locale** | `string` | `null` | Manually set the locale for the react-datetime instance. Moment.js locale needs to be loaded to be used, see [i18n docs](#i18n).
| **utc** | `boolean` | `false` | When true, input time values will be interpreted as UTC (Zulu time) by Moment.js. Otherwise they will default to the user's local timezone.
| **displayTimeZone** | `string` | `null` | **Needs [moment's timezone](https://momentjs.com/timezone/) available in your project.** When specified, input time values will be displayed in the given time zone. Otherwise they will default to the user's local timezone (unless `utc` specified).
| **onChange** | `function` | empty function | Callback trigger when the date changes. The callback receives the selected `moment` object as only parameter, if the date in the input is valid. If the date in the input is not valid, the callback receives the value of the input (a string). |
| **onOpen** | `function` | empty function | Callback trigger for when the user opens the datepicker. |
| **onClose** | `function` | empty function | Callback trigger for when the calendar get closed. The callback receives the selected `moment` object as only parameter, if the date in the input is valid. If the date in the input is not valid, the callback returns the value in the input. |
| **onNavigate** | `function` | empty function | Callback trigger when the view mode changes. The callback receives the selected view mode string (`years`, `months`, `days` or `time`) as only parameter.|
| **onBeforeNavigate** | `function` | ( nextView, currentView, viewDate ) => nextView | Allows to intercept a change of the calendar view. The accepted function receives the view that it's supposed to navigate to, the view that is showing currently and the date currently shown in the view. Return a viewMode ( default ones are `years`, `months`, `days` or `time`) to navigate to it. If the function returns a "falsy" value, the navigation is stopped and we will remain in the current view. |
| **onNavigateBack** | `function` | empty function | Callback trigger when the user navigates to the previous month, year or decade. The callback receives the amount and type ('month', 'year') as parameters. |
| **onNavigateForward** | `function` | empty function | Callback trigger when the user navigates to the next month, year or decade. The callback receives the amount and type ('month', 'year') as parameters. |
| **className** | `string` or `string array` | `''` | Extra class name for the outermost markup element. |
| **inputProps** | `object` | `undefined` | Defines additional attributes for the input element of the component. For example: `onClick`, `placeholder`, `disabled`, `required`, `name` and `className` (`className` *sets* the class attribute for the input element). |
| **isValidDate** | `function` | `() => true` | Define the dates that can be selected. The function receives `(currentDate, selectedDate)` and shall return a `true` or `false` whether the `currentDate` is valid or not.|
| **renderInput** | `function` | `undefined` | Replace the rendering of the input element. The function has the following arguments: the default calculated `props` for the input, `openCalendar` (a function which opens the calendar) and `closeCalendar` (a function which closes the calendar). Must return a React component or `null`. |
| **renderView** | `function` | `(viewMode, renderDefault) => renderDefault()` | Customize the way the calendar is rendered. The accepted function receives the type of the view it's going to be rendered `'years', 'months', 'days', 'time'` and a function to render the default view of react-datetime, this way it's possible to wrap the original view adding our own markup or override it completely with our own code.|
| **renderDay** | `function` | `DOM.td(day)` | Customize the way that the days are shown in the daypicker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, and must return a React component.|
| **renderMonth** | `function` | `DOM.td(month)` | Customize the way that the months are shown in the monthpicker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, the `month` and the `year` to be shown, and must return a React component. |
| **renderYear** | `function` | `DOM.td(year)` | Customize the way that the years are shown in the year picker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, the `year` to be shown, and must return a React component.|
| **strictParsing** | `boolean` | `true` | Whether to use Moment.js's [strict parsing](http://momentjs.com/docs/#/parsing/string-format/) when parsing input.
| **closeOnSelect** | `boolean` | `false` | When `true`, once the day has been selected, the datepicker will be automatically closed.
| **closeOnTab** | `boolean` | `true` | When `true` and the input is focused, pressing the `tab` key will close the datepicker.
| **timeConstraints** | `object` | `null` | Add some constraints to the timepicker. It accepts an `object` with the format `{ hours: { min: 9, max: 15, step: 2 }}`, this example means the hours can't be lower than `9` and higher than `15`, and it will change adding or subtracting `2` hours everytime the buttons are clicked. The constraints can be added to the `hours`, `minutes`, `seconds` and `milliseconds`.
| **closeOnClickOutside** | `boolean` | `true` | When the calendar is open and `closeOnClickOutside` is `true` (its default value), clickin outside of the calendar or input closes the calendar. If `false` the calendar stays open.|
