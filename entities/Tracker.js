class Tracker {
    #notifiedGoldRate = null;

    getNotifiedGoldRate() {
        return this.#notifiedGoldRate;
    }

    setNotifiedGoldRate(rate) {
        this.#notifiedGoldRate = rate;
    };
};

export default Tracker;
