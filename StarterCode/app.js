//////  !!!!!!  "Horizontal bar chart with a dropdown menu to display the top 10 OTUs"  !!!!!! //////

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples;
    let sample = samples[0];  // Default to the first sample initially
    
    // Get top 10 OTUs
    let otu_ids = sample.otu_ids.slice(0, 10).reverse();
    let sample_values = sample.sample_values.slice(0, 10).reverse();
    let otu_labels = sample.otu_labels.slice(0, 10).reverse();
    
    // Create yticks for bar chart labels
    let yticks = otu_ids.map(otuID => `OTU ${otuID}`);
    
    // Bar chart trace
    let barData = [
      {
        y: yticks,
        x: sample_values,
        text: otu_labels,
        type: "bar",
        orientation: "h",
        marker: {
          color: '#17BECF'
        }
      }
    ];
    
    // Bar chart layout
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 50, l: 100 },
      hovermode: "closest",
      plot_bgcolor: "#f7f7f7",
      paper_bgcolor: "#fafafa",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };
    
    // Plot bar chart
    Plotly.newPlot("bar", barData, barLayout);
});



/////// !!!!!!  "Bubble chart that displays each sample" !!!!!! //////

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples;
    let sample = samples[0];
    
    let otu_ids = sample.otu_ids;
    let otu_labels = sample.otu_labels;
    let sample_values = sample.sample_values;
    
    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values.map(val => val * 0.8),  // Adjust marker size
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest",
      plot_bgcolor: "#f4f4f4",
      paper_bgcolor: "#fafafa",
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
});


//// !!!!!!  "Display the sample metadata and each key-value pair from the metadata JSON object"  !!!!!! ////

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples;
    let sampleNames = data.names;
    let dropdown = d3.select("#selDataset");
    
    // Populate the dropdown with sample names
    sampleNames.forEach(sample => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Function to update the plots and metadata
    function updatePlots(selectedSample) {
      let resultArray = samples.filter(sampleObj => sampleObj.id == selectedSample);
      let result = resultArray[0];
      
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;
      
      let sampleMetadata = d3.select("#sample-metadata");
      
      // Clear existing content in the sample metadata
      sampleMetadata.html("");
      
      // Iterate over the key-value pairs in the metadata and display them on the page
      let metadataArray = data.metadata.filter(metadataObj => metadataObj.id == selectedSample);
      let metadataResult = metadataArray[0];
      Object.entries(metadataResult).forEach(([key, value]) => {
        sampleMetadata.append("p").text(`${key.toUpperCase()}: ${value}`);
      });

      // Update Bubble Chart
      Plotly.restyle("bubble", "x", [otu_ids]);
      Plotly.restyle("bubble", "y", [sample_values]);
      Plotly.restyle("bubble", "text", [otu_labels]);
      Plotly.restyle("bubble", "marker.size", [sample_values.map(val => val * 0.8)]);
      Plotly.restyle("bubble", "marker.color", [otu_ids]);

      // Update Bar Chart
      let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      Plotly.restyle("bar", "x", [sample_values.slice(0, 10).reverse()]);
      Plotly.restyle("bar", "y", [yticks]);
      Plotly.restyle("bar", "text", [otu_labels.slice(0, 10).reverse()]);
    }

    // Initialize the page with the first sample
    let initialSample = sampleNames[0];
    updatePlots(initialSample);

    // Event listener for sample selection
    dropdown.on("change", function() {
      let selectedSample = dropdown.property("value");
      updatePlots(selectedSample);
    });
});


//// !!! "Gauge chart to display weekly washing frequency of the individual"  !!!

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples;
    let sampleNames = data.names;
    
    // Function to update the gauge chart
    function updateGauge(selectedSample) {
      let metadataArray = data.metadata.filter(metadataObj => metadataObj.id == selectedSample);
      let metadataResult = metadataArray[0];
      let washFrequency = metadataResult.wfreq;

      let gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washFrequency,
          title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", font: { size: 18 } },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "#f4f4f4" },
              { range: [1, 2], color: "#e6e6e6" },
              { range: [2, 3], color: "#cccccc" },
              { range: [3, 4], color: "#bfbfbf" },
              { range: [4, 5], color: "#a6a6a6" },
              { range: [5, 6], color: "#999999" },
              { range: [6, 7], color: "#808080" },
              { range: [7, 8], color: "#666666" },
              { range: [8, 9], color: "#4d4d4d" }
            ]
          }
        }
      ];
      
      let gaugeLayout = {
        width: 500,
        height: 400,
        margin: { t: 20, b: 20 },
        paper_bgcolor: "#fafafa",
        font: { color: "darkblue", family: "Arial" }
      };
      
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    }

    // Set the initial gauge chart
    let initialSample = sampleNames[0];
    updateGauge(initialSample);

    // Event listener for dropdown changes to update gauge
    d3.select("#selDataset").on("change", function() {
      let selectedSample = d3.select("#selDataset").property("value");
      updateGauge(selectedSample);
    });
});
