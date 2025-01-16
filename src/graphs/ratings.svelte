<script>
    import { scaleBand, scaleLinear } from 'd3-scale';

    export let datapoints = [];
    export let year = 'releaseYear';
    export let rating = 'average_rating';

    let margins = { left: 50, top: 20, bottom: 50, right: 20 };

    // Adjust container dimensions for scaling
    let containerWidth = 350; 
    let containerHeight = containerWidth * 0.6;
    
    // Chart dimensions
    const chartWidth = containerWidth - margins.left - margins.right;
    const chartHeight = containerHeight - margins.top - margins.bottom;

    // Scales
    const scaleX = scaleBand()
        .domain(datapoints.map(d => parseInt(d[year]))) // Parse years to integers
        .range([0, chartWidth])
        .padding(0.1);

    // Y-axis is fixed to range 0 to 10
    const scaleY = scaleLinear()
        .domain([0, 10])
        .range([chartHeight, 0]);

    // Filter years to display only a subset of labels
    const xLabelsToShow = Math.ceil(datapoints.length / 10);
</script>

<svg width={containerWidth} height={containerHeight} style="border-radius: 10px;">
    <!-- Background -->
    <rect width="100%" height="100%" fill="#404040" rx="10" ry="10" />

    <!-- Chart Group -->
    <g transform={`translate(${margins.left}, ${margins.top})`}>
        <!-- Bars -->
        {#each datapoints as datapoint}
            <rect
                x={scaleX(parseInt(datapoint[year]))}
                y={scaleY(datapoint[rating])}
                width={scaleX.bandwidth()}
                height={chartHeight - scaleY(datapoint[rating])}
                fill="#7eafcb"
            />
        {/each}

        <!-- X-Axis Labels (Filtered) -->
        {#each datapoints as datapoint, i}
            {#if i % xLabelsToShow === 0}
                <text
                    x={scaleX(parseInt(datapoint[year])) + scaleX.bandwidth() / 2}
                    y={chartHeight + 20}
                    text-anchor="middle"
                    fill="white"
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
                    fill="white"
                    font-size="10"
                >
                    {tick}
                </text>
            </g>
        {/each}

        <!-- Labels -->
        <text
            x={chartWidth / 2}
            y={chartHeight + 40}
            text-anchor="middle"
            fill="white"
            font-size="12"
            font-weight="bold"
        >
            Release Year
        </text>
        <text
            x={-chartHeight / 2}
            y="-30"
            text-anchor="middle"
            transform="rotate(-90)"
            fill="white"
            font-size="12"
            font-weight="bold"
        >
            Average Rating
        </text>
    </g>
</svg>

<style>
    rect {
        transition: all 0.3s;
    }


    text {
        font-family: 'Roboto', sans-serif;
    }
</style>
