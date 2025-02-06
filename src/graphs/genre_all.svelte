<script>
    import { scaleBand, scaleLinear } from 'd3-scale';

    export let data = [];
    export let color1 = "#A0C4FF"; // Netflix
    export let color2 = "#fc90ac"; // Apple
    export let color3 = "#CAFFBF"; // Amazon

    const genresOrder = ['Drama', 'Comedy', 'Action', 'Romance', 'Thriller', 'Other'];
    let margins = { left: 60, top: 30, bottom: 40, right: 30 };
    let container;
    let containerWidth = 0;
    let containerHeight = 0;

    // Process data to include all genres in order with defaults
    $: processedData = genresOrder.map(genre => {
        const entry = data.find(d => d.genre === genre) || { netflix: 0, apple: 0, amazon: 0 };
        return {
            genre: genre,
            netflix: Math.max(0, Math.min(100, +entry.netflix || 0)),
            apple: Math.max(0, Math.min(100, +entry.apple || 0)),
            amazon: Math.max(0, Math.min(100, +entry.amazon || 0))
        };
    });

    // Chart dimensions
    $: chartWidth = containerWidth - margins.left - margins.right;
    $: chartHeight = containerHeight - margins.top - margins.bottom;

    // Scales
    $: scaleX = scaleBand()
        .domain(genresOrder)
        .range([0, chartWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    $: scaleSubgroup = scaleBand()
        .domain(['netflix', 'apple', 'amazon'])
        .range([0, scaleX.bandwidth()])
        .padding(0.25);

    $: maxYValue = Math.max(
        ...processedData.flatMap(d => [d.netflix, d.apple, d.amazon])
    );

    $: scaleY = scaleLinear()
        .domain([0, maxYValue])
        .range([chartHeight, 0])
        .nice();
</script>

<svg bind:clientWidth={containerWidth} bind:clientHeight={containerHeight} bind:this={container} style="width: 100%; height: 100%;">
    <g transform={`translate(${margins.left}, ${margins.top})`}>
        <!-- Bars -->
        {#each processedData as datapoint}
            {@const x = scaleX(datapoint.genre)}
            <g transform={`translate(${x}, 0)`}>
                <rect
                    x={scaleSubgroup('netflix')}
                    y={scaleY(datapoint.netflix)}
                    width={scaleSubgroup.bandwidth()}
                    height={chartHeight - scaleY(datapoint.netflix)}
                    fill={color1}
                    rx="5"
                />
                <rect
                    x={scaleSubgroup('apple')}
                    y={scaleY(datapoint.apple)}
                    width={scaleSubgroup.bandwidth()}
                    height={chartHeight - scaleY(datapoint.apple)}
                    fill={color2}
                    rx="5"
                />
                <rect
                    x={scaleSubgroup('amazon')}
                    y={scaleY(datapoint.amazon)}
                    width={scaleSubgroup.bandwidth()}
                    height={chartHeight - scaleY(datapoint.amazon)}
                    fill={color3}
                    rx="5"
                />
            </g>
        {/each}

        <!-- X Axis Labels -->
        {#each processedData as datapoint}
            <text
                x={scaleX(datapoint.genre) + scaleX.bandwidth() / 2}
                y={chartHeight + 20}
                text-anchor="middle"
                fill="lightgray"
                font-size="10"
            >
                {datapoint.genre}
            </text>
        {/each}

        <!-- Y Axis -->
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
                    {tick}%
                </text>
            </g>
        {/each}

        <!-- Axis Labels -->
        <text
            x={chartWidth / 2}
            y={chartHeight + margins.bottom - 10}
            text-anchor="middle"
            fill="lightgray"
            font-size="12"
        >
        </text>
        <text
            transform="rotate(-90)"
            y="-40"
            x={-chartHeight / 2}
            text-anchor="middle"
            fill="lightgray"
            font-size="12"
        >
            Percentage (%)
        </text>
    </g>
</svg>

<style>
    text {
        font-family: 'Roboto', sans-serif;
    }
</style>