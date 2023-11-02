import React from "react";
import "./App.css";
import moment from "moment";
moment.locale("fr", {
	//French date formats
	months:
		"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split(
			"_"
		),
	monthsShort:
		"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
	monthsParseExact: true,
	weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
	weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
	weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
	weekdaysParseExact: true,
	longDateFormat: {
		LT: "HH:mm",
		LTS: "HH:mm:ss",
		L: "DD/MM/YYYY",
		LL: "D MMMM YYYY",
		LLL: "D MMMM YYYY HH:mm",
		LLLL: "dddd D MMMM YYYY HH:mm"
	},
	calendar: {
		sameDay: "[Aujourd'hui à] LT",
		nextDay: "[Demain à] LT",
		nextWeek: "dddd [à] LT",
		lastDay: "[Hier à] LT",
		lastWeek: "dddd [dernier à] LT",
		sameElse: "L"
	},
	relativeTime: {
		future: "dans %s",
		past: "il y a %s",
		s: "quelques secondes",
		m: "une minute",
		mm: "%d minutes",
		h: "une heure",
		hh: "%d heures",
		d: "un jour",
		dd: "%d jours",
		M: "un mois",
		MM: "%d mois",
		y: "un an",
		yy: "%d ans"
	},
	dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
	ordinal: function (number) {
		return number + (number === 1 ? "er" : "e");
	},
	meridiemParse: /PD|MD/,
	isPM: function (input) {
		return input.charAt(0) === "M";
	},
	// In case the meridiem units are not separated around 12, then implement
	// this function (look at locale/id.js for an example).
	// meridiemHour : function (hour, meridiem) {
	//     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
	// },
	meridiem: function (hours, minutes, isLower) {
		return hours < 12 ? "PD" : "MD";
	},
	week: {
		dow: 1, // Monday is the first day of the week.
		doy: 4 // Used to determine first week of the year.
	}
});
const translations = {
	fr: {
		title: "Combien de temps jusqu'à Noël?",
		tagline: "Aujourd'hui, c'est ",
		christmas: "Noël est dans",
		days: "jour",
		hours: "heure",
		minutes: "minute",
		seconds: "seconde",
		merryxmas: "C'est aujourd'hui! Joyeux Noël!"
	},
	en: {
		title: "How long until Christmas?",
		tagline: "Today it is ",
		christmas: "Christmas is in",
		days: "day",
		hours: "hour",
		minutes: "minute",
		seconds: "second",
		merryxmas: "It's today! Merry Christmas!"
	}
};
class App extends React.Component<
	{},
	{
		days: string;
		hrs: string;
		min: string;
		sec: string;
		christmas: number;
		date: string;
		isToday: boolean;
		translation: "en" | "fr";
	}
> {
	interval: any;
	constructor(props: any) {
		super(props);
		this.state = {
			days: "0",
			hrs: "0",
			min: "0",
			sec: "0",
			christmas: 0,
			date: "",
			isToday: false,
			//@ts-ignore
			translation: document.location.href.includes("noel") ? "fr" : "en"
		};
	}
	getChristmas(locale: string) {
		moment.locale(locale);
		let date = new Date();
		let christmas = moment(new Date().getFullYear() + "-12-25");
		if (date.getMonth() === 11 && date.getDate() >= 25) {
			christmas = moment(new Date().getFullYear() + 1 + "-12-25");
		}
		return {
			date: moment().format("dddd, LL"),
			unix: christmas.unix() * 1000
		};
	}
	getDaysUntil(unix: number) {
		const diff = unix - Date.now();
		const sec = Math.floor((diff / 1000) % 60);
		const min = Math.floor((diff / (1000 * 60)) % 60);
		const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		return {
			days: days.toString(),
			hrs: hrs.toString(),
			min: min.toString(),
			sec: sec.toString()
		};
	}
	update(locale: string) {
		let today = new Date();
		if (today.getMonth() === 11 && today.getDate() === 25) {
			this.setState({ isToday: true });
		}
		let { unix, date } = this.getChristmas(locale);
		this.setState({ ...this.getDaysUntil(unix), christmas: unix, date });
	}
	componentDidMount(): void {
		this.update(this.state.translation);
		this.interval = setInterval(() => {
			this.setState({ ...this.getDaysUntil(this.state.christmas) });
		}, 1000);
	}
	componentWillUnmount(): void {
		clearInterval(this.interval);
	}
	render() {
		let translation = translations[this.state.translation];
		return (
			<div className="App">
				<title>{translation.title}</title>
				<div className="snowflake">❅</div>
				<div className="snowflake">❅</div>
				<div className="snowflake">❆</div>
				<div className="snowflake">❄</div>
				<div className="snowflake">❅</div>
				<div className="snowflake">❆</div>
				<div className="snowflake">❄</div>
				<div className="snowflake">❅</div>
				<div className="snowflake">❆</div>
				<div className="snowflake">❄</div>
				<div className="content">
					<h1>{translation.title}</h1>
					<h2>
						{translation.tagline}
						{this.state.date}
					</h2>
					<h2>
						{this.state.isToday ? (
							<>{translation.merryxmas}</>
						) : (
							<>
								{translation.christmas}...
								<br /> {this.state.days}{" "}
								{translation.days + (this.state.days != "1" ? "s" : "")},{" "}
								{this.state.hrs}{" "}
								{translation.hours + (this.state.hrs != "1" ? "s" : "")},{" "}
								{this.state.min}{" "}
								{translation.minutes + (this.state.min != "1" ? "s" : "")},{" "}
								{this.state.sec}{" "}
								{translation.seconds + (this.state.sec != "1" ? "s" : "")}
							</>
						)}
					</h2>
					<br />
					<a
						href={
							this.state.translation === "fr"
								? "https://christmas.cxllm.uk"
								: "https://noel.cxllm.uk"
						}
					>
						{
							this.state.translation === "fr"
								? "English" //<span className="fi fi-gb"></span>
								: "Français" //<span className="fi fi-fr"></span>
						}
					</a>
				</div>
			</div>
		);
	}
}

export default App;
