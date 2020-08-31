const entireSequence = [
  ...experimentData.sequences.pre_sequence,
  ...experimentData.sequences.main_sequence,
  ...experimentData.sequences.post_sequence,
];
for (let sequence of entireSequence) {
  const stimulus = sequence.stimulus;

  let style = (fontSize, fontColor) => {
    let sb = "";
    if (fontSize) sb += `font-size:${fontSize}px;`;
    if (fontColor) sb += `color:${fontColor};`;
    return sb;
  };

  let textStimulusHtml = (stimulus) => {
    return `<p style="${style(stimulus.fontSize, stimulus.fontColor)}">${
      stimulus.content
    }</p>`;
  };

  let imgStimulusHtml = (stimulus) => {
    return `<img src="${proxy}extracted/${gameId}/test/${stimulus.filePath}" >`;
  };

  let buffer = {
    type: sequence.choices ? "html-button-response" : "html-keyboard-response",
    stimulus: () => {
      switch (stimulus.stimulusType) {
        case StimulusType.TEXT:
          return textStimulusHtml(stimulus);
        case StimulusType.IMAGE:
          return imgStimulusHtml(stimulus);
        default:
          throw new Error(`Asset ${stimulus.stimulusType} is Unsupported Yet.`);
      }
    },
    stimulus_duration: sequence.stimulusDuration,
    trial_duration: sequence.reactionTime || sequence.stimulusDuration || null,
    choices: sequence.choices ? sequence.choices.map(textStimulusHtml) : null,
    correct_response: sequence.answer,
    test_part: "test",
    on_load: (d) => {},
    on_finish: (d) => {
      d.correct_answer = sequence.answer;
      d.choices = sequence.choices;
      store.push(d);
    },
  };

  timeline.push(buffer);

  switch (sequence.feedbackType) {
    case FeedbackType.ALWAYS:
      timeline.push({
        type: "html-keyboard-response",
        stimulus: textStimulusHtml(sequence.feedback1),
        stimulus_duration: sequence.feedbackDuration || null,
        trial_duration: sequence.feedbackDuration || null,
        response_ends_trial: false,
      });
      break;
    case FeedbackType.CHOICE:
      timeline.push({
        type: "html-keyboard-response",
        stimulus: () => {
          const choice = jsPsych.data.get().last(1).values()[0].choices[
            jsPsych.data.get().last(1).values()[0].button_pressed
          ];
          return choice ? textStimulusHtml(choice) : "<p>no choice</p>";
        },
        stimulus_duration: sequence.feedbackDuration || null,
        trial_duration: sequence.feedbackDuration || null,
        response_ends_trial: false,
      });
      break;
    case FeedbackType.TRUE_OR_FALSE:
      timeline.push({
        timeline: [
          {
            type: "html-keyboard-response",
            stimulus: textStimulusHtml(sequence.feedback1),
            stimulus_duration: sequence.feedbackDuration || null,
            trial_duration: sequence.feedbackDuration || null,
            response_ends_trial: false,
          },
        ],
        conditional_function: () => {
          const data = jsPsych.data.get().last(1).values()[0];
          console.log(data.button_pressed == data.correct_answer);
          return data.button_pressed == data.correct_answer;
        },
      });
      timeline.push({
        timeline: [
          {
            type: "html-keyboard-response",
            stimulus: textStimulusHtml(sequence.feedback2),
            stimulus_duration: sequence.feedbackDuration || null,
            trial_duration: sequence.feedbackDuration || null,
            response_ends_trial: false,
          },
        ],
        conditional_function: () => {
          const data = jsPsych.data.get().last(1).values()[0];
          console.log(data.button_pressed == data.correct_answer);
          return data.button_pressed != data.correct_answer;
        },
      });
      break;
  }
}

let timer = 0;
setInterval(() => {
  timer += 0.01;
  document.getElementById("time-indicator");
}, 10);
jsPsych.init({
  timeline,
});
