import moment from "moment-with-locales-es6";

const dateRange = (startDate, endDate, timeSeparator = " | ") => {
    const mStartDate = moment(startDate);
    const mEndDate = moment(endDate);

    const datePart = mStartDate.format("dddd");

    // const datePart = mStartDate.calendar(null, {lastDay : "[Yesterday]",
    //                                     sameDay : "[Idag]",
    //                                     nextDay : "[Imorgon]",
    //                                     lastWeek : "[Förra] dddd",
    //                                     nextWeek : "dddd",
    //                                     sameElse : "L"});
    return datePart + timeSeparator + mStartDate.format("HH") + " - " + mEndDate.format("HH");
};

export {
    dateRange
};