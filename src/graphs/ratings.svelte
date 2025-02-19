<script>
    import { scaleBand, scaleLinear } from "d3-scale";
    import { line, curveMonotoneX } from "d3";

    export let datapoints1 = [];
    export let datapoints2 = [];
    export let datapoints3 = [];
    export let year = "releaseYear";
    export let rating = "average_rating";

    export let animationDelay = 0.0;

    export let color1 = "#A0C4FF";
    export let color2 = "#CAFFBF";

    let minWidth = 250; // Minimum width to show X labels
    let minHeight = 100; // Minimum height to show Y labels

    const line_width = 1.5;

    const allData = [...datapoints1];

    let margins = { left: 0, top: 0, bottom: 0, right: 0 };

    let container;
    let containerWidth = 0;
    let containerHeight = 0;

    // Update margins if container size is below the minimum
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
        .domain(allData.map((d) => parseInt(d[year]))) // Parse years to integers
        .range([0, chartWidth])
        .padding(0.1);

    // Y-axis is fixed to range 5 to 9
    $: scaleY = scaleLinear().domain([5, 9]).range([chartHeight, 0]);

    $: lineGenerator = line()
        .curve(curveMonotoneX)
        .x((d) => scaleX(parseInt(d[year])))
        .y((d) => scaleY(d[rating]))
        .defined(function (d) {
            return d[rating] > 1.0;
        });

    // Filter years to display only a subset of labels
    $: xLabelsToShow = Math.ceil(allData.length / 6);

    // Tooltip variables
    let tooltipVisible = false;
    let tooltipPosition = { x: 0, y: 0 };
    let tooltipYear = null;
    let tooltipValues = [];
    let verticalLineX = null;

    function getRelativePosition(event) {
        const rect = container.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    function handleMouseMove(event) {
        // Get precise mouse position relative to the SVG
        const svgRect = container.getBoundingClientRect();
        const mouseX = event.clientX - svgRect.left - margins.left;
        const mouseY = event.clientY - svgRect.top - margins.top;

        // Only process if within chart bounds
        if (
            mouseX < 0 ||
            mouseX > chartWidth ||
            mouseY < 0 ||
            mouseY > chartHeight
        ) {
            tooltipVisible = false;
            return;
        }

        // Calculate band positions
        const years = allData.map((d) => parseInt(d[year]));
        const bandWidth = scaleX.bandwidth();
        const step = chartWidth / years.length;

        // Find closest year index
        const closestIndex = Math.min(
            years.length - 1,
            Math.max(0, Math.floor(mouseX / step)),
        );
        const closestYear = years[closestIndex];

        if (true) {
            verticalLineX = scaleX(closestYear) + bandWidth / 2;
            tooltipYear = closestYear;

            // Get values from all datasets
            tooltipValues = [
                {
                    value: datapoints3.find(
                        (d) => parseInt(d[year]) === closestYear,
                    )?.[rating],
                    color: color2,
                },
                {
                    value: datapoints2.find(
                        (d) => parseInt(d[year]) === closestYear,
                    )?.[rating],
                    color: color1,
                },
            ];

            const pos = getRelativePosition(event);
            // Update tooltip position
            tooltipPosition = {
                x: pos.x + 15,
                y: pos.y - 10,
            };
            tooltipVisible = true;
        }
    }

    function handleMouseLeave() {
        tooltipVisible = false;
        verticalLineX = null;
    }
</script>

<svg
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
    bind:this={container}
    style="width: 100%; height: 100%;"
>
    <!-- Chart Group -->
    <g transform={`translate(${margins.left}, ${margins.top})`}>
        <path
            d={lineGenerator(datapoints2)}
            fill="none"
            stroke={color1}
            stroke-width={line_width}
        />

        <path
            d={lineGenerator(datapoints3)}
            fill="none"
            stroke={color2}
            stroke-width={line_width}
        />

        <!-- Gray Boy: Covering rectangle that shrinks to reveal the lines -->
        <rect
            x="0"
            y="0"
            width={chartWidth}
            height={chartHeight}
            fill="#404040"
            pointer-events="none"
        >
            <animate
                attributeName="x"
                from="0"
                to={chartWidth}
                begin={animationDelay}
                dur="0.8s"
                fill="freeze"
            />
            <animate
                attributeName="width"
                from={chartWidth}
                to="0"
                begin={animationDelay}
                dur="0.8s"
                fill="freeze"
            />
        </rect>

        <!-- X-Axis Labels (Filtered) -->
        {#if containerWidth >= minWidth && containerHeight >= minHeight}
            {#each allData as datapoint, i}
                {#if i % xLabelsToShow === 8 && containerWidth >= minWidth && containerHeight >= minHeight}
                    <text
                        x={scaleX(parseInt(datapoint[year])) +
                            scaleX.bandwidth() / 2}
                        y={chartHeight + 20}
                        text-anchor="middle"
                        fill="lightgray"
                        font-size="10"
                    >
                        {parseInt(datapoint[year])}
                    </text>
                {/if}
            {/each}
        {/if}
        <!-- Y-Axis -->
        {#each scaleY.ticks(5) as tick}
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
                        {tick}
                    </text>
                {/if}
            </g>
        {/each}

        {#if containerWidth >= minWidth && containerHeight >= minHeight}
            <text
                x={-chartHeight / 2}
                y="-30"
                text-anchor="middle"
                transform="rotate(-90)"
                fill="lightgray"
                font-size="10"
                font-weight="bold"
            >
                Average Rating
            </text>
        {/if}

        <!-- Vertical line -->
        <line
            x1={verticalLineX}
            y1={0}
            x2={verticalLineX}
            y2={chartHeight}
            stroke="white"
            stroke-width={1}
            opacity={tooltipVisible ? 0.3 : 0}
            class="vertical-line"
        />

        <!-- Mouse interaction area -->
        <rect
            x={0}
            y={0}
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
            on:mousemove={handleMouseMove}
            on:mouseleave={handleMouseLeave}
        />
    </g>
</svg>

<!-- Tooltip HTML -->
<div
    class="tooltip"
    style:left={`${tooltipPosition.x}px`}
    style:top={`${tooltipPosition.y}px`}
    class:visible={tooltipVisible}
>
    {#if tooltipYear}
        <div class="year">{tooltipYear}</div>
        {#each tooltipValues as item}
            <div class="tooltip-item">
                <span style="color: {item.color}; margin:auto; display:table;">
                    {isNaN(parseFloat(item.value)) || item.value === ""
                        ? "-"
                        : parseFloat(item.value).toFixed(1)}
                </span>
            </div>
        {/each}
    {/if}
</div>

<style>
    text {
        font-family: "Manrope", sans-serif;
        opacity: 0.5;
    }

    .tooltip {
        position: absolute;
        pointer-events: none;
        background: rgba(25, 25, 25, 0.6);
        color: white;
        padding: 8px;
        border-radius: 4px;
        font-family: "Manrope", sans-serif;
        font-size: 10px;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 100;
        backdrop-filter: blur(3px);
    }

    .tooltip.visible {
        opacity: 1;
    }

    .year {
        margin-bottom: 4px;
    }

    .tooltip-item {
        display: flex;
        align-items: center;
        font-weight: bold;
        gap: 6px;
        margin: 2px 0;
    }
</style>
