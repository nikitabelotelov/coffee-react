export enum LoggerLevel {
    VERBOSE = 3,
    WARNINGS = 2,
    ERRORS = 1
}

let logger = {
    level: LoggerLevel.VERBOSE,
    log: function(data?: any) {
        if(this.level >= LoggerLevel.VERBOSE) {
            console.log.apply(console, arguments)
        }
    },
    warn: function(data?: any) {
        if(this.level >= LoggerLevel.WARNINGS) {
            console.warn.apply(console, arguments)
        }
    },
    error: function(data?: any) {
        if(this.level >= LoggerLevel.ERRORS) {
            console.error.apply(console, arguments)
        }
    }
}

export {logger}