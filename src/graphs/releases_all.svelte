<script>
    import { scaleBand, scaleLinear } from 'd3-scale';
    import {line, curveCardinal } from 'd3';

    export let datapoints1 = [];
    export let datapoints2 = [];    
    export let datapoints3 = [];
    export let datapoints4 = [];
    export let year = 'releaseYear';
    export let rating = 'count';

    const allData = datapoints4;

    let margins = { left: 60, top: 30, bottom: 40, right: 30 };

    let container; 
    let containerWidth = 0; 
    let containerHeight = 0; 

    const line_width = 3;

    // Chart dimensions
    $: chartWidth = containerWidth - margins.left - margins.right;
    $: chartHeight = containerHeight - margins.top - margins.bottom;

    // Scales
    $: scaleX = scaleBand()
        .domain(allData.map(d => parseInt(d[year]))) // Parse years to integers
        .range([0, chartWidth])
        .padding(0.1);

    // Y-axis is fixed to range 5 to 9  
    $: scaleY = scaleLinear()
        .domain([0, 4000])
        .range([chartHeight, 0]);

    $: lineGenerator = line()
        .curve(curveCardinal.tension(0.9))
        .x(d => scaleX(parseInt(d[year])))
        .y(d => scaleY(d[rating]))
        .defined(function (d) { return d[rating] > 1.0 ; });

    // Filter years to display only a subset of labels
    $: xLabelsToShow = Math.ceil(allData.length / 10);
</script>


<svg bind:clientWidth={containerWidth} bind:clientHeight={containerHeight} bind:this={container} style="width: 100%; height: 100%;">

    <!-- Chart Group -->
    <g transform={`translate(${margins.left}, ${margins.top})`}>

        <path d={lineGenerator(datapoints2)} opacity="1.0" fill="none" stroke="#ff94ae" stroke-width={line_width} />

        <path d={lineGenerator(datapoints3)} opacity="0.7" fill="none" stroke="#CAFFBF" stroke-width={line_width} />

        <path d={lineGenerator(datapoints1)} opacity="0.8" fill="none" stroke="#A0C4FF" stroke-width={line_width} />


        <!-- X-Axis Labels (Filtered) -->
        {#each allData as datapoint, i}
            {#if i % xLabelsToShow === 0}
                <text
                    x={scaleX(parseInt(datapoint[year])) + scaleX.bandwidth() / 2}
                    y={chartHeight + 20}
                    text-anchor="middle"
                    fill="lightgray"
                    font-size="10"
                >
                    {parseInt(datapoint[year])}
                </text>
            {/if}
        {/each}

        <!-- Y-Axis -->
        {#each scaleY.ticks(5) as tick}
            <g transform={`translate(0, ${scaleY(tick)})`}>
                <line x1="0" x2={chartWidth} stroke="gray" stroke-dasharray="2,2" />
                <text
                    x="-10"
                    y="5"
                    text-anchor="end"
                    fill="lightgray"
                    font-size="10"
                >
                    {tick}
                </text>
            </g>
        {/each}

        <!-- Labels -->
        
        <text
            x={-chartHeight / 2}
            y="-30"
            text-anchor="middle"
            transform="rotate(-90)"
            fill="lightgray"
            font-size="12"
            font-weight="bold"
        >
            
        </text>
    </g>
</svg>

<style>
    text {
        font-family: 'Roboto', sans-serif;
    }
</style>
