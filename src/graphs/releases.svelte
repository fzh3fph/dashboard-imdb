<script>
    import { scaleBand, scaleLinear } from 'd3-scale';
    import { stack, stackOrderNone, stackOffsetNone } from 'd3-shape';

    export let data = [];
    export let year = 'year';

    export let color1 = "#A0C4FF"; 
    export let color2 = "#CAFFBF";

    let margins = { left: 60, top: 30, bottom: 40, right: 30 };
    let container;
    let containerWidth = 0;
    let containerHeight = 0;

    /// Convert and validate data
    $: processedData = data.map(d => {
        const yearVal = +d.year || 0;
        const moviesVal = +d.movies || 0; // Force numeric, default to 0
        const tvVal = +d.tv || 0; // Force numeric, default to 0
        
        return {
            year: yearVal,
            movies: moviesVal,
            tv: tvVal
        };
    });

    // Chart dimensions
    $: chartWidth = containerWidth - margins.left - margins.right;
    $: chartHeight = containerHeight - margins.top - margins.bottom;

    // Calculate max total with validation
    $: maxTotal = processedData.length ? Math.max(
            ...processedData.map(d => {
                const total = d.movies + d.tv;
                return Number.isFinite(total) ? total : 0;
            })
        ) : 0;

    // Validate scaleX domain
    $: scaleX = scaleBand()
        .domain(processedData.map(d => d.year)) // Use original year strings
        .range([0, chartWidth])
        .padding(0.1);    

    $: scaleY = scaleLinear()
        .domain([0, maxTotal])
        .range([chartHeight, 0]);

    // Stack generator
    $: stackGenerator = stack()
        .keys(['movies', 'tv'])
        .order(stackOrderNone)
        .offset(stackOffsetNone);

    $: series = processedData.length ? stackGenerator(processedData) : [];

    // X-axis label filtering
    $: xLabelsToShow = Math.ceil(processedData.length / 6);

</script>

<svg bind:clientWidth={containerWidth} bind:clientHeight={containerHeight} bind:this={container} style="width: 100%; height: 100%;">
    <g transform={`translate(${margins.left}, ${margins.top})`}>
        <!-- Stacked bars -->
        {#each series as layer, i}
            {#each layer as d}
                {@const y0 = Number.isFinite(d[0]) ? d[0] : 0}
                {@const y1 = Number.isFinite(d[1]) ? d[1] : 0}
                <rect
                    x={scaleX(d.data.year)}
                    y={scaleY(y1)}
                    width={scaleX.bandwidth()}
                    height={scaleY(y0) - scaleY(y1)}
                    fill={i === 0 ? color1 : color2}
                />
            {/each}
        {/each}

        <!-- X-Axis Labels -->
        {#each processedData as datapoint, i}
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
    </g>
</svg>

<style>
    text {
        font-family: 'Roboto', sans-serif;
    }
</style>