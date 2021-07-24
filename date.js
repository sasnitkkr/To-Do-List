
// console.log(module);

module.exports = {
    getDate : function()
    {
        const date = new Date();
        const options = {
            weekday : "long",
            month: "long",
            day: "numeric"
        }
        var today = date.toLocaleDateString('en-US', options);
        return today;
    },
    getDay : function(){
        const date = new Date();
        const options = {
            weekday : "long",
        }
        var today = date.toLocaleDateString('en-US', options);
        return today;
    }
    
}
// module.exports = function()
// {
//     const date = new Date();
//     const options = {
//         weekday : "long",
//         month: "long",
//         day: "numeric"
//     }
//     var today = date.toLocaleDateString('en-US', options);
//     return today;
// };

// module.exports = function(){
//     const date = new Date();
//     const options = {
//         weekday : "long",
//     }
//     var today = date.toLocaleDateString('en-US', options);
//     return today;
// };
// module.exports = function()
// {
//     const date = new Date();
//     const options = {
//         weekday : "long",
//         month: "long",
//         day: "numeric"
//     }
//     var today = date.toLocaleDateString('en-US', options);
//     return today;
// };

// module.exports = function(){
//     const date = new Date();
//     const options = {
//         weekday : "long",
//     }
//     var today = date.toLocaleDateString('en-US', options);
//     return today;
// };
