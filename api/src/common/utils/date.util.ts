import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

const date = dayjs;
date.extend(utc);
date.extend(timezone);

export default date;
