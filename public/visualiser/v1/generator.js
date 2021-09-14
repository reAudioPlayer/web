//initialise simplex noise instance
var noise = new SimplexNoise();
const container = document.getElementById('out');

// the main visualiser function
var vizInit = function () {
    var file = document.getElementById("thefile");
    var audio = window.players[0];
    var context;
    var src;
    var fileLabel = document.querySelector("label.file");

    file.onchange = async function () {
        fileLabel.classList.add('normal');
        //audio.classList.add('active');
        var file = this.files[0];
        var md = await getMetaData(file)
        console.log(md)
        loadToAudioPlayer(URL.createObjectURL(file), file.name, md)

        if (!src)
        {
            play();
        }

        const img = document.getElementById("reap.0-cover");
        if (img.complete) {
            loadColours()
        } else {
            img.addEventListener('load', loadColours);
        }
    }

    async function getMetaData(file) {
        const tags = await new Promise((resolve, reject) => {
            const x = new jsmediatags.Reader(file)
                .read({
                    onSuccess: (tag) => {
                        console.log('Success!');
                        resolve(tag);
                    },
                    onError: (error) => {
                        console.log('Error');
                        reject(error);
                    }
                });
        })
        const {
            data,
            format
        } = tags.tags.picture;
        return {
            cover: getCoverAsData(format, data),
            title: tags.tags.title,
            artist: tags.tags.artist,
            album: tags.tags.album
        }
    }

    function getCoverAsData(format, data)
    {
        let base64String = "";
        for (let i = 0; i < data.length; i++) {
            base64String += String.fromCharCode(data[i]);
        }
        return `data:${format};base64,${window.btoa(base64String)}`;
    }

    function play() {
        context = context || new AudioContext();
        src = src || context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
        src.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 512;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        //here comes the webgl
        var scene = new THREE.Scene();
        var group = new THREE.Group();
        var camera = new THREE.PerspectiveCamera(45, container.getBoundingClientRect().width / container
            .getBoundingClientRect().height, 0.1, 1000);
        camera.position.set(0, 0, 100);
        camera.lookAt(scene.position);
        scene.add(camera);

        var renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(container.getBoundingClientRect().width, container.getBoundingClientRect().height);

        var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
        window.mPlane = new THREE.MeshLambertMaterial();

        var plane = new THREE.Mesh(planeGeometry, window.mPlane);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 30, 0);
        group.add(plane);

        var plane2 = new THREE.Mesh(planeGeometry, window.mPlane);
        plane2.rotation.x = -0.5 * Math.PI;
        plane2.position.set(0, -30, 0);
        group.add(plane2);

        var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
        window.mOrbit = new THREE.MeshLambertMaterial();

        var ball = new THREE.Mesh(icosahedronGeometry, window.mOrbit);
        ball.position.set(0, 0, 0);
        group.add(ball);

        var ambientLight = new THREE.AmbientLight(0xaaaaaa);
        scene.add(ambientLight);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.intensity = 0.9;
        spotLight.position.set(-10, 40, 20);
        spotLight.lookAt(ball);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        // orbitControls.autoRotate = true;

        scene.add(group);

        container.appendChild(renderer.domElement);
        window.addEventListener('resize', debounce(() => onWindowResize()), false);

        function debounce(func, timeout = 250) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                }, timeout);
            };
        }

        render();

        function render() {
            analyser.getByteFrequencyData(dataArray);

            var lowerHalfArray = dataArray.slice(0, (dataArray.length / 2) - 1);
            var upperHalfArray = dataArray.slice((dataArray.length / 2) - 1, dataArray.length - 1);

            var overallAvg = avg(dataArray);
            var lowerMax = max(lowerHalfArray);
            var lowerAvg = avg(lowerHalfArray);
            var upperMax = max(upperHalfArray);
            var upperAvg = avg(upperHalfArray);

            var lowerMaxFr = lowerMax / lowerHalfArray.length;
            var lowerAvgFr = lowerAvg / lowerHalfArray.length;
            var upperMaxFr = upperMax / upperHalfArray.length;
            var upperAvgFr = upperAvg / upperHalfArray.length;

            makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
            makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));

            makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0,
                4));

            group.rotation.y += 0.005;
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        function onWindowResize() {
            camera.aspect = container.getBoundingClientRect().width / container.getBoundingClientRect().height;
            camera.updateProjectionMatrix();
            renderer.setSize(container.getBoundingClientRect().width, container.getBoundingClientRect().height);
        }

        function makeRoughBall(mesh, bassFr, treFr) {
            mesh.geometry.vertices.forEach(function (vertex, i) {
                var offset = mesh.geometry.parameters.radius;
                var amp = 5;
                var time = window.performance.now();
                vertex.normalize();
                var rf = 0.00001;
                var distance = (offset + bassFr) + noise.noise3D(vertex.x + time * rf * 7, vertex.y +
                    time * rf * 8,
                    vertex.z + time * rf * 9) * amp * treFr;
                distance = distance < 0.1 ? 0.1 : distance;
                vertex.multiplyScalar(distance);
            });
            mesh.geometry.verticesNeedUpdate = true;
            mesh.geometry.normalsNeedUpdate = true;
            mesh.geometry.computeVertexNormals();
            mesh.geometry.computeFaceNormals();
        }

        function makeRoughGround(mesh, distortionFr) {
            mesh.geometry.vertices.forEach(function (vertex, i) {
                var amp = 2;
                var time = Date.now();
                var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) *
                    distortionFr *
                    amp;
                vertex.z = distance;
            });
            mesh.geometry.verticesNeedUpdate = true;
            mesh.geometry.normalsNeedUpdate = true;
            mesh.geometry.computeVertexNormals();
            mesh.geometry.computeFaceNormals();
        }

        audio.play();
    };
}

document.body.addEventListener('touchend', function (ev) {
    context.resume();
});

//some helper functions here
function fractionate(val, minVal, maxVal) {
    return (val - minVal) / (maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr) {
    var total = arr.reduce(function (sum, b) {
        return sum + b;
    });
    return (total / arr.length);
}

function max(arr) {
    return arr.reduce(function (a, b) {
        return Math.max(a, b);
    })
}