import LinkedList from './LinkendList.mjs';

export default class Graph {
    #matrizAdyacencia = [];
    #map = new Map();

    constructor() {}

    addVertices(...vertices) {
        for (let value of vertices) {
            this.#matrizAdyacencia.push(new LinkedList());
            this.#map.set(value, this.#matrizAdyacencia.length - 1);
        }
    }

    addV(value) {
        this.#matrizAdyacencia.push(new LinkedList());
        this.#map.set(value, this.#matrizAdyacencia.length - 1);
    }

    addConexion(start, end, weight = 1) {
        if (this.#map.has(start) && this.#map.has(end)) {
            this.#matrizAdyacencia[this.#map.get(start)].push(end, weight);
            return true;
        }
        return false;
    }

    bfs(callback) {
        let queue = [];
        let list = [];
        const entries = [...structuredClone(this.#map)];
        for (let i = 0; i < this.#matrizAdyacencia.length; i++)
            list[i] = false;

        let [key] = entries[0];
        queue.push(key);

        while (queue.length > 0) {
            let val = queue.shift();
            callback(val);
            list[this.#map.get(val)] = true;
            for (let i = 0; i < this.#matrizAdyacencia[this.#map.get(val)].length; i++) {
                if (this.#matrizAdyacencia[this.#map.get(val)][i]) {
                    let [key] = entries[i];
                    if (!list[this.#map.get(key)] && !queue.includes(key))
                        queue.push(key);
                }
            }
        }
    }

    dfs(callback) {
        let stack = [];
        let list = [];
        const entries = [...structuredClone(this.#map)];
        for (let i = 0; i < this.#matrizAdyacencia.length; i++)
            list[i] = false;
        let [key] = entries[0];
        stack.push(key);

        while (stack.length > 0) {
            let val = stack.pop();
            if (!list[this.#map.get(val)]) {
                callback(val);
                list[this.#map.get(val)] = true;
                let neighbors = [...this.#matrizAdyacencia[this.#map.get(val)].iterator()];
                for (let i = neighbors.length - 1; i >= 0; i--) {
                    let neighbor = neighbors[i];
                    if (!list[this.#map.get(neighbor.name)])
                        stack.push(neighbor.name);
                }
            }
        }
    }

    dijkstra(start, end) {
        const distances = new Map();
        const predecessors = new Map();
        const visited = new Set();
        const pq = new Map();
        
        for (let vertex of this.#map.keys()) {
            distances.set(vertex, Infinity);
        }
        distances.set(start, 0);
        pq.set(start, 0);
        
        while (pq.size > 0) {
            let [current, currentDistance] = [...pq.entries()].reduce((a, b) => a[1] < b[1] ? a : b);
            pq.delete(current);

            if (current === end) {
                const path = [];
                let step = end;
                while (step) {
                    path.unshift(step);
                    step = predecessors.get(step);
                }
                return { distance: currentDistance, path };
            }
            
            visited.add(current);

            let neighbors = [...this.#matrizAdyacencia[this.#map.get(current)].iterator()];
            for (let neighbor of neighbors) {
                if (!visited.has(neighbor.name)) {
                    let newDist = currentDistance + neighbor.distance;
                    if (newDist < distances.get(neighbor.name)) {
                        distances.set(neighbor.name, newDist);
                        predecessors.set(neighbor.name, current);
                        pq.set(neighbor.name, newDist);
                    }
                }
            }
        }

        return { distance: Infinity, path: [] };
    }
}