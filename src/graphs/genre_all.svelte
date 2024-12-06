<script>
    import { arc, pie } from 'd3-shape';
    import { scaleOrdinal } from 'd3-scale';
    import { schemePastel1 } from 'd3-scale-chromatic';

    export let datapoints = [];

    let margins = { top: 20, right: 20, bottom: 40, left: 20 };

    // Chart dimensions
    let width = 480;
    let height = width * 0.6;
    let radius = Math.min(width, height) / 2 - 40;

    // Sort datapoints by count in descending order
    datapoints = [...datapoints].sort((a, b) => b.count - a.count);

    // Create pie chart arc generator
    const pieChart = pie()
        .value(d => d.count)
        .sort(null); // Sort is disabled to keep the order as is in the sorted data

    // Arc generator for the donut chart
    const arcGenerator = arc()
        .innerRadius(radius - 40)
        .outerRadius(radius);

    // Color scale using pastel colors
    const color = scaleOrdinal(schemePastel1);

    // Prepare data for pie chart
    const chartData = pieChart(datapoints);

    // Track hovered genre and cursor position
    let hoveredGenre = '';
    let cursorPosition = { x: 0, y: 0 };

    // Update cursor position
    const updateCursorPosition = (event) => {
        cursorPosition = { x: event.clientX, y: event.clientY };
    };
</script>

<svg width={width} height={height} on:mousemove={updateCursorPosition}>
    <!-- Background Circle (Donut) -->
    <g transform={`translate(${width / 2}, ${height / 2})`}>
        {#each chartData as segment, index}
            <path
                d={arcGenerator(segment)}
                fill={color(index)}
                stroke="white"
                stroke-width="1"
                on:mouseenter={() => hoveredGenre = datapoints[index].genre}
                on:mouseleave={() => hoveredGenre = ''}
            />
        {/each}
    </g>
</svg>

<!-- Hovered Genre Name Display at Cursor -->
{#if hoveredGenre}
    <div style="position: absolute; top: {cursorPosition.y + 10}px; left: {cursorPosition.x + 10}px; padding: 8px 12px; background: rgba(0, 0, 0, 0.7); color: white; font-family: 'Roboto', sans-serif; font-size: 14px; border-radius: 5px;">
        {hoveredGenre}
    </div>
{/if}

<style>
    svg {
        background-color: #404040;
        border-radius: 10px;
    }

    path {
        transition: all 0.3s ease;
    }

    path:hover {
        opacity: 0.8;
        cursor: pointer;
    }
</style>
