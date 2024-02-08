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

    toArray(): number[] {
        let arr = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                arr.push(this.data[i][j]);
            }
        }
        return arr;
    }

    static from2DArray(arr: number[][]): Matrix {
        let m = new Matrix(arr.length, arr[0].length);
        m.data = arr;
        return m;
    }

    static fromArray(arr: number[]): Matrix {
        return new Matrix(arr.length, 1).map((_, i) => arr[i]);
    }

    static subtract(A: Matrix, B: Matrix) {
        if (A.rows !== B.rows || A.cols !== B.cols) {
            throw new Error("Columns and rows of A must match columns and rows of B.");
        }
        return new Matrix(A.rows, A.cols).map((_, i, j) => A.data[i][j] - B.data[i][j]);
    }

    subtract(A: Matrix | number): Matrix {
        if (A instanceof Matrix) {
            if (this.rows !== A.rows || this.cols !== A.cols) {
                throw new Error("Columns and rows of A must match columns and rows of B.");
            }
            return this.map((e, i, j) => e - A.data[i][j]);
        } else {
            return this.map((e) => e - A);
        }
    }

    static add(A: Matrix, B: Matrix) {
        if (A.rows !== B.rows || A.cols !== B.cols) {
            throw new Error("Columns and rows of A must match columns and rows of B.");
        }
        return new Matrix(A.rows, A.cols).map((_, i, j) => A.data[i][j] + B.data[i][j]);
    }

    add(A: Matrix | number): Matrix {
        if (A instanceof Matrix) {
            if (this.rows !== A.rows || this.cols !== A.cols) {
                throw new Error("Columns and rows of A must match columns and rows of B.");
            }
            return this.map((e, i, j) => e + A.data[i][j]);
        } else {
            return this.map((e) => e + A);
        }
    }
    static multiply(A: Matrix, B: Matrix) {
        // Element wise multiplication
        if (A.rows !== B.rows || A.cols !== B.cols) {
            throw new Error("Columns and rows of A must match columns and rows of B.");
        }
        return new Matrix(A.rows, A.cols).map((_, i, j) => A.data[i][j] * B.data[i][j]);
    }

    multiply(A: Matrix | number): Matrix {
        if (A instanceof Matrix) {
            if (this.rows !== A.rows || this.cols !== A.cols) {
                throw new Error("Columns and rows of A must match columns and rows of B.");
            }
            // Element wise multiplication
            return this.map((e, i, j) => e * A.data[i][j]);
        } else {
            // Scalar product
            return this.map((e) => e * A);
        }
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

    dot(A: Matrix): Matrix {
        if (this.cols !== A.rows) {
            throw new Error("Columns of A must match rows of B.");
        }
        return new Matrix(this.rows, A.cols).map((_, i, j) => {
            let sum = 0;
            for (let k = 0; k < this.cols; k++) {
                sum += this.data[i][k] * A.data[k][j];
            }
            return sum;
        });
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

    map(func: (e: number, i: number, j: number) => number): Matrix {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val, i, j);
            }
        }
        return this;
    }

    print() {
        console.table(this.data);
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }

    static deserialize(data: string): Matrix | null {
        try {
            const m = JSON.parse(data);
            if ("rows" in m && "cols" in m && "data" in m) {
                const matrix = new Matrix(m.rows, m.cols);
                matrix.data = m.data;
                return matrix;
            } else {
                console.error("Invalid data for Matrix deserialization");
                return null;
            }
        } catch (error) {
            console.error("Failed to parse JSON for Matrix deserialization", error);
            return null;
        }
    }
}
