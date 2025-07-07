"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type StrapiImage = { url: string };

type Event = {
    id: number;
    NameOfTheEvent: string;
    Description: string;
    StartOfTime: string;
    EventPicture?: StrapiImage[];
};

export default function EventsPage() {
    const searchParams = useSearchParams();
    const locale = (searchParams.get("locale") as "en" | "de") || "en";

    const t = {
        en: {
            title: "Upcoming Events",
            languageLabel: "Language:",
            viewDetails: "View Details",
            loadError: "Couldn't load events.",
        },
        de: {
            title: "Bevorstehende Veranstaltungen",
            languageLabel: "Sprache:",
            viewDetails: "Details ansehen",
            loadError: "Veranstaltungen konnten nicht geladen werden.",
        },
    }[locale];

    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setError("");
        setLoading(true);

        axios
            .get(
                `http://localhost:1337/api/events?populate=EventPicture&locale=${locale}`
            )
            .then((res) => {
                setEvents(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(t.loadError);
                setLoading(false);
            });
    }, [locale, t.loadError]);

    return (
        <div className="events-container">
            <div className="events-header">
                <h1 className="events-title">{t.title}</h1>
                <div className="language-switcher">
                    <label className="language-label">{t.languageLabel}</label>
                    <select
                        className="language-select"
                        value={locale}
                        onChange={(e) => {
                            const loc = e.target.value;
                            window.location.search = `?locale=${loc}`;
                        }}
                    >
                        <option value="en">🇺🇸 English</option>
                        <option value="de">🇩🇪 Deutsch</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                </div>
            )}

            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading events...</p>
                </div>
            )}

            {!loading && !error && (
                <div className="events-grid">
                    {events.map((evt) => {
                        const imgUrl =
                            evt.EventPicture?.[0]?.url
                                ? `http://localhost:1337${evt.EventPicture[0].url}`
                                : "/placeholder-event.jpg";
                        const date = new Date(evt.StartOfTime).toLocaleString(locale);

                        return (
                            <div key={evt.id} className="event-card">
                                <div className="event-image-container">
                                    <img
                                        src={imgUrl}
                                        alt={evt.NameOfTheEvent}
                                        className="event-image"
                                    />
                                    <div className="event-overlay"></div>
                                </div>

                                <div className="event-card-content">
                                    <h2 className="event-name">{evt.NameOfTheEvent}</h2>
                                    <p className="event-date">{date}</p>
                                    <p className="event-description">{evt.Description}</p>

                                    <Link
                                        href={`/events/${evt.id}?locale=${locale}`}
                                        className="event-details-link"
                                    >
                                        <span>{t.viewDetails}</span>
                                        <svg className="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && !error && events.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h3>No events found</h3>
                    <p>Check back later for upcoming events.</p>
                </div>
            )}
        </div>
    );
}
