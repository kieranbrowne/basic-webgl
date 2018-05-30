
main();

function main() {
    const canvas = document.querySelector("#glCanvas");

    let width = window.innerWidth*.45;
    let devicePixelRatio = window.devicePixelRatio || 1;
    canvas.style.width = width + "px";
    canvas.style.height = width + "px";
    canvas.width = width * devicePixelRatio;
    canvas.height = width * devicePixelRatio;
    

    // Initialize the GL context
    const gl = canvas.getContext("webgl",
            { alpha: true,
                antialias: true,
                depth: false,
                premultipliedAlpha: false });

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.lineWidth(8);
    console.log(gl.getParameter(gl.LINE_WIDTH));

    function createShader (gl, sourceCode, type) {
        // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
        var shader = gl.createShader( type );
        gl.shaderSource( shader, sourceCode );
        gl.compileShader( shader );

        if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
            var info = gl.getShaderInfoLog( shader );
            throw 'Could not compile WebGL program. \n\n' + info;
        }
        return shader;
    }

    gl.clearColor(0.94, 0.94, 0.94, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
        gl.enable(gl.DEPTH_TEST);

    const program = gl.createProgram();

    const vertShader = createShader(gl,document.getElementById('vertexshader').text, gl.VERTEX_SHADER);
    const fragShader = createShader(gl,document.getElementById('fragmentshader').text, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);


    gl.linkProgram(program);
    gl.useProgram(program);

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
        var info = gl.getProgramInfoLog(program);
        throw 'Could not compile WebGL program. \n\n' + info;
    }

    var aspect = canvas.width / canvas.height;

    var shape = new Float32Array([
            // X, Y ,          R, G, B
            0.0,  0.5,  1.0, 0.0, 0.0, // red
            0.5, -0.3,  0.0, 1.0, 0.0, // red
            -0.5, -.3,  0.0, 0.0, 1.0, // red
    ]);

    var datapoints = new Float32Array([
            // X, Y ,          R, G, B
            0.2, 0.352, 1.0, 0.0, 0.0, // red
            0.21, 0.5, 1.0, 0.0, 0.0, // red
            0.31, 0.8, 1.0, 0.0, 0.0, // red
            0.41, 0.7, 1.0, 0.0, 0.0, // red
            0.5,0.5,  0.0, 0.0, 1.0, // blue
            0.8,0.25,  0.0, 0.0, 1.0, // blue
            0.1,0.15,  0.0, 0.0, 1.0, // blue
            0.4,0.25,  0.0, 0.0, 1.0, // blue
            0.2,0.95,  0.0, 0.0, 1.0, // blue
    ]);

    var lines = new Float32Array([
            // X, Y ,          R, G, B
            0.0, -2.0,   0.5, 0.5, 0.5, // mid grey
            0.0,  2.0,   0.5, 0.5, 0.5, // mid grey
            2.0,  0.0,   0.5, 0.5, 0.5, // mid grey
            -2.0, 0.0,   0.5, 0.5, 0.5, // mid grey
    ]);

    vbuffer = gl.createBuffer();
    sbuffer = gl.createBuffer();
    lbuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, lbuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, lines, gl.STATIC_DRAW);

    itemSize = 5;
    numItems = datapoints.length / itemSize;


    // Pass data to GPU
    program.vertexPosition = 
        gl.getAttribLocation(program, "vertexPosition");
    program.vertexColor = 
        gl.getAttribLocation(program, "vertexColor");

    gl.enableVertexAttribArray(program.vertexPosition);
    gl.enableVertexAttribArray(program.vertexColor);


    // set pixel density
    gl.uniform1f(
            gl.getUniformLocation(
                program, 
                "uPixelDensity"), 
            devicePixelRatio);

    program.uColor = gl.getUniformLocation(program, "uColor");
    gl.uniform4fv(program.uColor, [1.0, 0.3, 0.0, 1.0]);
    program.uTime = gl.getUniformLocation(program, "uTime");
    gl.uniform1f(program.uTime, Math.random());
    program.uSlidePos = gl.getUniformLocation(program, "uSlidePos");
    gl.uniform1f(program.uSlidePos, 0.0);



    // Main draw loop

    const draw = (timestamp) => {
        // clear drawing buffers
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
        gl.clear(gl.COLOR_BUFFER_BIT)

        // update time
        gl.uniform1f(program.uTime, timestamp/1000);

        // update slide pos
        gl.uniform1f(program.uSlidePos, slidePos());

        // drawShape
        colouredPoints(sbuffer,shape, gl.POINTS);
        colouredPoints(sbuffer,shape, gl.LINE_LOOP);

        // draw points
        // colouredPoints(vbuffer,datapoints, gl.POINTS);


        // draw lines
        colouredPoints(lbuffer,lines, gl.LINES);

        // gl.enableVertexAttribArray(program.vertexPosition);
        // gl.enableVertexAttribArray(program.vertexColor);
        // loop
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);


    function slidePos() {
        return window.pageYOffset / document.getElementById("main").children[0].scrollHeight
        // return window.pageYOffset / 
        //     document.body.scrollHeight * 
        //     document.getElementById("main").children.length
    }

    function colouredPoints(buff, points, draw_type=gl.POINTS) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

        gl.vertexAttribPointer(
                program.vertexPosition, // pointer to memory
                2,  // elements per attribute
                gl.FLOAT, // element type
                gl.FALSE,  // normalised?
                // size of individual element in memory
                5 * Float32Array.BYTES_PER_ELEMENT, 
                0 // offset from beginning of each vertex
                );
        gl.vertexAttribPointer(
                program.vertexColor, // pointer to memory
                3,  // elements per attribute
                gl.FLOAT, // element type
                gl.FALSE,  // normalised?
                // size of individual element in memory
                5 * Float32Array.BYTES_PER_ELEMENT, 
                // offset from beginning of each vertex
                2 * Float32Array.BYTES_PER_ELEMENT 
                );
        gl.drawArrays(draw_type, 0, points.length / 5);

    }

}

