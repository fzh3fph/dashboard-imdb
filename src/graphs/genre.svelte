<script>
    import { scaleBand, scaleLinear } from "d3-scale";

    export let data = [];
    export let color1 = "#A0C4FF";
    export let color2 = "#CAFFBF";

    export let animationDelay = 0.0;

    const genresOrder = [
        "Drama",
        "Comedy",
        "Action",
        "Romance",
        "Thriller",
        "Other",
    ];
    let margins = { left: 0, top: 0, bottom: 0, right: 0 };
    let container;
    let containerWidth = 0;
    let containerHeight = 0;

    let minWidth = 250; // Minimum width to show X labels
    let minHeight = 100; // Minimum height to show Y labels

    let uniqueId1 = `opacityGradient-${Math.random().toString(36).substr(2, 9)}`;
    let uniqueId2 = `opacityGradient-${Math.random().toString(36).substr(2, 9)}`;

    // Process data to include all genres in order with defaults
    $: processedData = genresOrder.map((genre) => {
        const entry = data.find((d) => d.genre === genre) || {
            movies: 0,
            tv: 0,
        };
        return {
            genre: genre,
            movies: Math.max(0, Math.min(100, +entry.movies || 0)),
            tv: Math.max(0, Math.min(100, +entry.tv || 0)),
        };
    });

    $: {
        if (containerWidth < minWidth || containerHeight < minHeight) {
            margins = { left: 16, top: 16, bottom: 16, right: 16 };
        } else {
            margins = { left: 50, top: 30, bottom: 40, right: 30 };
        }
    }

    // Chart dimensions
    $: chartWidth = containerWidth - margins.left - margins.right;
    $: chartHeight = containerHeight - margins.top - margins.bottom;

    // Scales
    $: scaleX = scaleBand()
        .domain(genresOrder)
        .range([0, chartWidth])
        .paddingInner(0.1)
        .paddingOuter(0.1);

    $: scaleSubgroup = scaleBand()
        .domain(["movies", "tv"])
        .range([0, scaleX.bandwidth()])
        .padding(0.1);

    $: maxYValue = 60;

    $: scaleY = scaleLinear()
        .domain([0, maxYValue])
        .range([chartHeight, 0])
        .nice();

    function getRelativePosition(event) {
        const rect = container.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    let tooltipData = {
        show: false,
        x: 0,
        y: 0,
        value: 0,
    };
</script>

<svg
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
    bind:this={container}
    style="width: 100%; height: 100%;"
>
    <g transform={`translate(${margins.left}, ${margins.top})`}>
        <!-- Bars -->
        {#each processedData as datapoint}
            {@const x = scaleX(datapoint.genre)}
            <g transform={`translate(${x}, 0)`}>
                <defs>
                    <linearGradient id={uniqueId1} x1="0" x2="0" y1="0" y2="1">
                        <stop
                            offset="0%"
                            stop-color={color1}
                            stop-opacity="1"
                        />
                        <stop
                            offset="100%"
                            stop-color={color1}
                            stop-opacity="0.4"
                        />
                    </linearGradient>
                </defs>

                <defs>
                    <linearGradient id={uniqueId2} x1="0" x2="0" y1="0" y2="1">
                        <stop
                            offset="0%"
                            stop-color={color2}
                            stop-opacity="1"
                        />
                        <stop
                            offset="100%"
                            stop-color={color2}
                            stop-opacity="0.4"
                        />
                    </linearGradient>
                </defs>

                <rect
                    x={scaleSubgroup("movies")}
                    y={scaleY(datapoint.movies)}
                    width={scaleSubgroup.bandwidth()}
                    height={chartHeight - scaleY(datapoint.movies)}
                    fill={`url(#${uniqueId1})`}
                    rx="2"
                    on:mouseover={(e) => {
                        const pos = getRelativePosition(e);
                        tooltipData = {
                            show: true,
                            x: pos.x,
                            y: pos.y,
                            value: datapoint.movies,
                        };
                    }}
                    on:mousemove={(e) => {
                        const pos = getRelativePosition(e);
                        tooltipData = {
                            ...tooltipData,
                            x: pos.x,
                            y: pos.y,
                        };
                    }}
                    on:mouseout={() => (tooltipData.show = false)}
                />
                <rect
                    x={scaleSubgroup("tv")}
                    y={scaleY(datapoint.tv)}
                    width={scaleSubgroup.bandwidth()}
                    height={chartHeight - scaleY(datapoint.tv)}
                    fill={`url(#${uniqueId2})`}
                    rx="2"
                    on:mouseover={(e) => {
                        const pos = getRelativePosition(e);
                        tooltipData = {
                            show: true,
                            x: pos.x,
                            y: pos.y,
                            value: datapoint.tv,
                        };
                    }}
                    on:mousemove={(e) => {
                        const pos = getRelativePosition(e);
                        tooltipData = {
                            ...tooltipData,
                            x: pos.x,
                            y: pos.y,
                        };
                    }}
                    on:mouseout={() => (tooltipData.show = false)}
                />
            </g>
        {/each}

        <!-- Gray Boy: Covering rectangle that shrinks to reveal the lines -->
        <defs>
            <filter id="blur-bottom" x="0" y="0" width="100%" height="100%">
                <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="0 8"
                    result="blur"
                />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="1" intercept="0" />
                </feComponentTransfer>
            </filter>
        </defs>
        <rect
            x="0"
            y="0"
            width={chartWidth}
            height={chartHeight}
            fill="#404040"
            pointer-events="none"
            filter="url(#blur-bottom)"
        >
            <animate
                attributeName="height"
                from={chartHeight}
                to="0"
                begin={animationDelay}
                dur="0.4s"
                fill="freeze"
            />
        </rect>
        <rect
            x="0"
            y="0"
            width={chartWidth}
            height={chartHeight / 2}
            fill="#404040"
            pointer-events="none"
        >
            <animate
                attributeName="height"
                from={chartHeight / 2}
                to="0"
                begin={animationDelay}
                dur="0.4s"
                fill="freeze"
            />
        </rect>

        <!-- X Axis Labels -->
        {#each processedData as datapoint}
            {#if containerWidth >= minWidth && containerHeight >= minHeight}
                <text
                    x={scaleX(datapoint.genre) + scaleX.bandwidth() / 2}
                    y={chartHeight + 20}
                    text-anchor="middle"
                    fill="lightgray"
                    font-size="8"
                >
                    {datapoint.genre}
                </text>
            {/if}
        {/each}

        <!-- Y Axis -->
        {#each scaleY.ticks(4) as tick}
            <g transform={`translate(0, ${scaleY(tick)})`}>
                <line
                    x1="0"
                    x2={chartWidth}
                    stroke="gray"
                    stroke-dasharray="2,2"
                    opacity="0.3"
                />
                {#if containerWidth >= minWidth && containerHeight >= minHeight}
                    <text
                        x="-10"
                        y="5"
                        text-anchor="end"
                        fill="lightgray"
                        font-size="10"
                    >
                        {tick}%
                    </text>
                {/if}
            </g>
        {/each}
    </g>
</svg>

{#if tooltipData.show}
    <div
        class="tooltip"
        style="left: {tooltipData.x + 15}px; 
                top: {tooltipData.y - 10}px;"
    >
        {tooltipData.value.toFixed(0)}%
    </div>
{/if}

<style>
    text {
        font-family: "Manrope", sans-serif;
        opacity: 0.5;
    }

    .tooltip {
        position: absolute;
        background: rgba(25, 25, 25, 0.6);
        color: white;
        padding: 8px;
        border-radius: 4px;
        pointer-events: none;
        font-size: 10px;
        font-weight: bold;
        font-family: "Manrope", sans-serif;
        z-index: 100;
        backdrop-filter: blur(3px);
    }
</style>
