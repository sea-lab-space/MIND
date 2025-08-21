import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import {Button as MuiButton, Typography} from "@mui/material";
import * as React from "react";

interface TimelineDataItem {
    key: string;
    label: string;
    date: string;
}

interface TimeLineGraphProps {
    selectedTimeline: string | null;
    handleTimelineSelect: (key: string) => void;
    timelineData?: TimelineDataItem[];
}

const timelineData = [
    { key: 'first-session', label: 'First Session', date: '2021-03-18' },
    { key: 'second-session', label: 'Second Session', date: '2021-04-11' },
    { key: 'lastSession', label: 'Session Recap', date: '2021-05-09' },
    { key: 'recapToday', label: 'Summary Today', date: '2021-06-07' },
    { key: 'insights', label: 'Patient Data Insights (05-09 to 06-07)', date: ''},
    { key: 'medicalHistory', label: 'Medical History (before 03-18)', date: ''}
];

const TimeLineGraph: React.FC<TimeLineGraphProps> = ({
                                                         selectedTimeline,
                                                         handleTimelineSelect,
                                                     }) => {



    const getButtonStyles = (key) => ({
        fontSize: "12px",
        textTransform: "none",
        whiteSpace: "nowrap",
        minwidth: 85,
        width: 100,
        color: selectedTimeline === key ? 'white' : 'black',
        border: selectedTimeline === key ? '1px solid #A0A0A0' : '1px solid grey',
        backgroundColor: selectedTimeline === key ? 'grey' : 'transparent',
        '&:hover': {
            backgroundColor: '#666',
            border: '1px solid grey',
            color: 'white'
        },
    });

    return (
      <Timeline
        sx={{
          width: "224px",
          paddingLeft: 0,
          marginLeft: "-14px",
          marginTop: "10px",
        }}
      >
        <TimelineItem>
          <TimelineOppositeContent
            color="textSecondary"
            sx={{
              whiteSpace: "nowrap",
              fontSize: "12px",
              width: 85,
              marginTop: selectedTimeline === timelineData[5].key ? "105px" : "65px", // This line aligns the date with the dot
            }}
          >
            {timelineData[0].date}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector
              sx={{
                height: selectedTimeline === timelineData[5].key ? "100px" : "60px",
              }}
            />
            <TimelineDot />
            <TimelineConnector sx={{ height: "30px" }} />
          </TimelineSeparator>
          <TimelineContent>
            <div
              style={{
                backgroundColor:
                  selectedTimeline === timelineData[5].key ? "grey" : "#EAEAEA",
                borderRadius: "4px",
                height:
                  selectedTimeline === timelineData[5].key ? "90px" : "50px",
                marginTop: "2px",
                width: "100%",
                display: "flex", // enable flexbox
                alignItems: "center", // vertical center
                justifyContent: "center", // horizontal center
                textAlign: "center", // fallback for text
                cursor: "pointer", // <-- add this
                transition: "height 0.2s ease, background-color 0.2s ease",
                marginBottom: "5px"
              }}
              onClick={() => {
                handleTimelineSelect(timelineData[5].key);
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  padding: "3px",
                  color: selectedTimeline === timelineData[5].key ? "white" : "black",
                  width: 100,
                }}
              >
                {timelineData[5].label}
              </Typography>
            </div>
            <MuiButton
              disabled={true}
              variant="outlined"
              size="small"
              onClick={() => handleTimelineSelect(timelineData[0].key)}
              sx={getButtonStyles(timelineData[0].key)}
            >
              {timelineData[0].label}
            </MuiButton>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent
            color="textSecondary"
            sx={{
              whiteSpace: "nowrap",
              fontSize: "12px",
              width: 85,
            }}
          >
            {timelineData[1].date}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector sx={{ height: "30px" }} />
          </TimelineSeparator>
          <TimelineContent>
            <MuiButton
              disabled={true}
              variant="outlined"
              size="small"
              onClick={() => handleTimelineSelect(timelineData[1].key)}
              sx={getButtonStyles(timelineData[1].key)}
            >
              {timelineData[1].label}
            </MuiButton>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent
            color="textSecondary"
            sx={{
              whiteSpace: "nowrap",
              fontSize: "12px",
              marginTop: "5px",
              color: "grey",
              width: 85,
            }}
          >
            {timelineData[2].date}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector
              sx={{
                height: "70px",
              }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <MuiButton
              variant="outlined"
              size="small"
              onClick={() => handleTimelineSelect(timelineData[2].key)}
              sx={getButtonStyles(timelineData[2].key)}
            >
              {timelineData[2].label}
            </MuiButton>
            <div
              style={{
                backgroundColor:
                  selectedTimeline === "insights" ? "grey" : "#EAEAEA",
                borderRadius: "4px",
                height:
                  selectedTimeline === timelineData[4].key ? "180px" : "100px",
                marginTop: "2px",
                width: "100%",
                display: "flex", // enable flexbox
                alignItems: "center", // vertical center
                justifyContent: "center", // horizontal center
                textAlign: "center", // fallback for text
                cursor: "pointer", // <-- add this
                transition: "height 0.2s ease, background-color 0.2s ease",
              }}
              onClick={() => {
                handleTimelineSelect(timelineData[4].key);
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  padding: "3px",
                  color: selectedTimeline === "insights" ? "white" : "black",
                }}
              >
                {timelineData[4].label}
              </Typography>
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent
            color="textSecondary"
            sx={{
              whiteSpace: "nowrap",
              fontSize: "12px",
              marginTop: "5px",
              width: 85,
            }}
          >
            {timelineData[3].date}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>
            <MuiButton
              variant="outlined"
              size="small"
              onClick={() => handleTimelineSelect(timelineData[3].key)}
              sx={getButtonStyles(timelineData[3].key)}
            >
              {timelineData[3].label}
            </MuiButton>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );
}

export default TimeLineGraph