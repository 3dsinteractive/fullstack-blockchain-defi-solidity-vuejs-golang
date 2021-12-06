package utils

import (
	"database/sql/driver"
	"errors"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// TimeUnit represent time unit
type TimeUnit string

const (
	// TimeUnitMilliSeconds is milli seconds unit
	TimeUnitMilliSeconds TimeUnit = "milliseconds"
	// TimeUnitSeconds is the seconds unit
	TimeUnitSeconds TimeUnit = "seconds"
	// TimeUnitMinutes is the minutes unit
	TimeUnitMinutes TimeUnit = "minutes"
	// TimeUnitHours is the hours unit
	TimeUnitHours TimeUnit = "hours"
	// TimeUnitDays is the days unit
	TimeUnitDays TimeUnit = "days"
	// TimeUnitMonths is the months unit
	TimeUnitMonths TimeUnit = "months"
)

// Timestamp is the type for time.Time
type Timestamp time.Time

// Timestamp layouts
const (
	TimestampLayout            string = "2006-01-02 15:04:05"
	TimestampLayoutMs          string = "2006-01-02 15:04:05.000"
	TimestampLayoutWithoutTime string = "2006-01-02"
	TimestampLayoutNoSecond    string = "2006-01-02 15:04"
)

// Errors
var (
	ErrTimeStringIsRequired = errors.New("time string is required")
)

type InvalidTimestampFormatError struct {
	t string
}

func NewInvalidTimestampFormatError(time string) *InvalidTimestampFormatError {
	return &InvalidTimestampFormatError{time}
}

func (e *InvalidTimestampFormatError) Error() string {
	return fmt.Sprintf("invalid timestamp format: %s", e.t)
}

func NewTimestampFromMs(ms string) (*Timestamp, error) {
	if len(ms) == 0 {
		return nil, ErrTimeStringIsRequired
	}
	millis, err := strconv.ParseInt(string(ms), 10, 64)
	if err != nil {
		return nil, &InvalidTimestampFormatError{ms}
	}
	t := time.Unix(0, millis*int64(time.Millisecond))
	return NewTimestampT(t), nil
}

// TimestampZero is the default value for timestamp
// time.Parse(timestampLayout, "0001-01-01 00:00:00")
// var TimestampZero Timestamp

// NewTimestamp from string
func NewTimestamp(t string) (*Timestamp, error) {
	if len(t) == 0 {
		return nil, ErrTimeStringIsRequired
	}
	t = strings.TrimSpace(t)
	layout := timestampLayout(t)
	if layout == "" {
		return nil, &InvalidTimestampFormatError{t}
	}
	tm, err := time.Parse(layout, t)
	if err != nil {
		return nil, err
	}
	ts := Timestamp(tm)
	return &ts, nil
}

// NewTimestampT cast from time to Timestamp
func NewTimestampT(t time.Time) *Timestamp {
	tm := Timestamp(t)
	return &tm
}

func (t *Timestamp) IsSameDay(with *Timestamp) bool {
	if with == nil {
		return false
	}
	tm := t.Time()
	wtm := with.Time()

	return (tm.Year() == wtm.Year()) && (tm.Month() == wtm.Month()) && (tm.Day() == wtm.Day())
}

// Diff return positive number when diffWith less than t
// Diff return negative number when diffWith greater than t
// Return value will be in TimeUnit unit
// Return value will round up to integer number
// Default return value is in Nanoseconds unit
func (t *Timestamp) Diff(diffWith *Timestamp, unit TimeUnit) int64 {
	tm := t.Time()
	duration := tm.Sub(*diffWith.Time())

	if unit == TimeUnitSeconds {
		res := duration.Seconds()
		if res < 0 {
			return int64(math.Floor(res))
		}
		return int64(math.Ceil(res))
	} else if unit == TimeUnitMinutes {
		res := duration.Minutes()
		if res < 0 {
			return int64(math.Floor(res))
		}
		return int64(math.Ceil(res))
	} else if unit == TimeUnitHours {
		res := duration.Hours()
		if res < 0 {
			return int64(math.Floor(res))
		}
		return int64(math.Ceil(res))
	} else if unit == TimeUnitDays {
		res := duration.Hours() / 24
		if res < 0 {
			return int64(math.Floor(res))
		}
		return int64(math.Ceil(res))
	} else if unit == TimeUnitMonths {
		res := duration.Hours() / 24 / 30
		if res < 0 {
			return int64(math.Floor(res))
		}
		return int64(math.Ceil(res))
	}

	return duration.Nanoseconds() / int64(time.Millisecond)
}

// Time return time.Time
func (t *Timestamp) Time() *time.Time {
	tm := time.Time(*t)
	return &tm
}

// Add add duration and return new timestamp
func (t *Timestamp) Add(duration time.Duration) *Timestamp {
	return NewTimestampT(t.Time().Add(duration))
}

// UnmarshalJSON transform string to Timestamp (use via golang reflection when parsing JSON)
func (t *Timestamp) UnmarshalJSON(src []byte) error {
	str := strings.Trim(string(src), "\"")
	if len(string(str)) == 0 {
		return nil
	}

	ts, err := NewTimestamp(string(str))
	if err != nil {
		return err
	}
	*t = *ts
	return nil
}

// Do not removed
// String return string represent Timestamp (use via golang reflection in fmt package)
func (t *Timestamp) String() string {
	return t.DateTimeString()
}

// DateTimeString return date time in string format 2006-01-02 15:04:05
func (t *Timestamp) DateTimeString() string {
	return time.Time(*t).Format(TimestampLayout)
}

// DateTimeStringRoundSecondToZero return date time in string format 2006-01-02 15:04:00, and round seconds part to zero
func (t *Timestamp) DateTimeStringRoundSecondToZero() string {
	tm := t.Time()
	// 2006-01-02 15:04:00
	return fmt.Sprintf("%04d-%02d-%02d %02d:%02d:00", tm.Year(), tm.Month(), tm.Day(), tm.Hour(), tm.Minute())
}

// DateTimeStringMs return date time in string format 2006-01-02 15:04:05.999
func (t *Timestamp) DateTimeStringMs() string {
	return time.Time(*t).Format(TimestampLayoutMs)
}

// DateString return date part of timestamp as string in format 2006-01-02
func (t *Timestamp) DateString() string {
	return time.Time(*t).Format(TimestampLayoutWithoutTime)
}

// ShortDateString return date part of timestamp as string in format MM-DD
func (t *Timestamp) ShortDateString() string {
	str := time.Time(*t).Format(TimestampLayoutWithoutTime)
	// Remove year part
	return str[5:]
}

// ShortDateTimeString return date part of timestamp as string in format MM-DD HH:mm
func (t *Timestamp) ShortDateTimeString() string {
	str := time.Time(*t).Format(TimestampLayoutNoSecond)
	// Remove year part
	return str[5:]
}

// HourString return HH:00
func (t *Timestamp) HourString() string {
	tm := t.Time()
	return fmt.Sprintf("%02d:00", tm.Hour())
}

func (t *Timestamp) YearMonthString() string {
	tm := t.Time()
	return fmt.Sprintf("%04d-%02d", tm.Year(), tm.Month())
}

// YearMonthAlias return year and month in format 200601
func (t *Timestamp) YearMonthAlias() string {
	tm := t.Time()
	return fmt.Sprintf("%04d%02d", tm.Year(), tm.Month())
}

// YearMonthDayAlias return year, month and day in format 20060102
func (t *Timestamp) YearMonthDayAlias() string {
	tm := t.Time()
	return fmt.Sprintf("%04d%02d%02d", tm.Year(), tm.Month(), tm.Day())
}

// YearMonthTimeAlias return year, month and time in format 20060102150405
func (t *Timestamp) YearMonthTimeAlias() string {
	tm := t.Time()
	return fmt.Sprintf("%04d%02d%02d%02d%02d%02d", tm.Year(), tm.Month(), tm.Day(), tm.Hour(), tm.Minute(), tm.Second())
}

// Milliseconds return current timestamp in milliseconds
func (t *Timestamp) Milliseconds() int64 {
	return t.Time().UnixNano() / int64(time.Millisecond)
}

// Unix timestamp is Unix time, the number of seconds elapsed
// since January 1, 1970 UTC.
// UnixSeconds return unix timestamp in seconds
func (t *Timestamp) UnixSeconds() int {
	return int(t.Time().Unix())
}

// Unix timestamp is Unix time, the number of seconds elapsed
// since January 1, 1970 UTC.
// UnixHours return unix timestamp in hours
func (t *Timestamp) UnixHours() int {
	return t.UnixSeconds() / (60 * 60)
}

// MarshalJSON tranform Timestamp to string (use via golang reflection when parsing JSON)
func (t *Timestamp) MarshalJSON() ([]byte, error) {
	str := fmt.Sprintf(`"%s"`, time.Time(*t).Format(TimestampLayout))
	return []byte(str), nil
}

// Value convert timestampe to sql value (use via golang reflection when send data to RDBMS via ORM)
func (t Timestamp) Value() (driver.Value, error) {
	ts := t.Time()
	return *ts, nil
}

// Scan db datetime to timestamp (use via golang reflection when query using ORM)
func (t *Timestamp) Scan(value interface{}) error {
	if value == nil {
		t = nil
		return nil
	}

	v, ok := value.(time.Time)
	if ok {
		*t = *NewTimestampT(v)
	}
	return nil
}

var timestampLayoutRegex *regexp.Regexp

func getTimestampLayoutRegex() *regexp.Regexp {
	if timestampLayoutRegex == nil {
		timestampLayoutRegex = regexp.MustCompile(`^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$`)
	}
	return timestampLayoutRegex
}

var timestampLayoutWithoutTimeRegex *regexp.Regexp

func getTimestampLayoutWithoutTimeRegex() *regexp.Regexp {
	if timestampLayoutWithoutTimeRegex == nil {
		timestampLayoutWithoutTimeRegex = regexp.MustCompile(`^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$`)
	}
	return timestampLayoutWithoutTimeRegex
}

func timestampLayout(s string) string {
	switch {
	case getTimestampLayoutRegex().MatchString(s):
		return TimestampLayout
	case getTimestampLayoutWithoutTimeRegex().MatchString(s):
		return TimestampLayoutWithoutTime
	default:
		return ""
	}
}
