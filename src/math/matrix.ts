export class Matrix {
    public rows: number;
    public cols: number;
    public data: number[][];
    public shape: [number, number];

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.data = Array(this.rows)
            .fill(0)
            .map(() => Array(this.cols).fill(0));
        this.shape = [this.rows, this.cols];
    }

    static fromArray2D(arr: number[][]): Matrix {
        const m = new Matrix(arr.length, arr[0].length);
        m.data = arr;
        return m;
    }

    static fromArray1D(arr: number[]): Matrix {
        const m = new Matrix(arr.length, 1);
        m.data = arr.map((x) => [x]);
        return m;
    }

    static subtract(A: Matrix, B: Matrix) {
        if (A.rows !== B.rows || A.cols !== B.cols) {
            throw new Error("Columns and rows of A must match columns and rows of B.");
        }
        return new Matrix(A.rows, A.cols).map((_, i, j) => A.data[i][j] - B.data[i][j]);
    }

    static add(A: Matrix, B: Matrix) {
        if (A.rows !== B.rows || A.cols !== B.cols) {
            throw new Error("Columns and rows of A must match columns and rows of B.");
        }
        return new Matrix(A.rows, A.cols).map((_, i, j) => A.data[i][j] + B.data[i][j]);
    }

    static multiply(A: Matrix, B: Matrix) {
        // Element wise multiplication
        if (A.rows !== B.rows || A.cols !== B.cols) {
            throw new Error("Columns and rows of A must match columns and rows of B.");
        }
        return new Matrix(A.rows, A.cols).map((_, i, j) => A.data[i][j] * B.data[i][j]);
    }

    static dot(A: Matrix, B: Matrix): Matrix {
        if (A.cols !== B.rows) {
            throw new Error("Columns of A must match rows of B.");
        }
        return new Matrix(A.rows, B.cols).map((_, i, j) => {
            let sum = 0;
            for (let k = 0; k < A.cols; k++) {
                sum += A.data[i][k] * B.data[k][j];
            }
            return sum;
        });
    }

    static sum(A: Matrix): number {
        let sum = 0;
        A.forEach((e) => (sum += e));
        return sum;
    }

    summed(): number {
        return Matrix.sum(this);
    }

    static transpose(A: Matrix): Matrix {
        return new Matrix(A.cols, A.rows).map((_, i, j) => A.data[j][i]);
    }

    transposed(): Matrix {
        return Matrix.transpose(this);
    }

    static map(A: Matrix, func: (e: number, i: number, j: number) => number): Matrix {
        return new Matrix(A.rows, A.cols).map((e, i, j) => func(e, i, j));
    }

    randomize(func: () => number): Matrix {
        return this.map((_) => func());
    }

    copy(): Matrix {
        let m = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                m.data[i][j] = this.data[i][j];
            }
        }
        return m;
    }

    map(func: (e: number, i: number, j: number) => number): Matrix {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val, i, j);
            }
        }
        return this;
    }

    forEach(func: (e: number, i: number, j: number) => void): void {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                func(val, i, j);
            }
        }
    }

    print() {
        console.table(this.data);
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }

    static deserialize(data: string): Matrix {
        try {
            const m = JSON.parse(data);
            if ("rows" in m && "cols" in m && "data" in m) {
                const matrix = new Matrix(m.rows, m.cols);
                matrix.data = m.data;
                return matrix;
            } else {
                throw new Error("Invalid data for Matrix deserialization");
            }
        } catch (error) {
            throw new Error("Failed to parse JSON for Matrix deserialization: " + error);
        }
    }

    toArray2D(): number[][] {
        return JSON.parse(JSON.stringify(this.data));
    }

    toArray1D(): number[] {
        if (this.cols !== 1) {
            throw new Error("Matrix must have 1 column to convert to 1D array");
        }
        return JSON.parse(JSON.stringify(this.data.map((x) => x[0])));
    }
}
