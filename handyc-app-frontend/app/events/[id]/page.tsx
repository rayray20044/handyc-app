"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type StrapiImage = { url: string };

type EventDetail = {
    id: number;
    Description: string;
    NameOfTheEvent: string;
    StartOfTime: string;
    EndTime: string;
    EventType: string;
    MaxCap: string;
    Langauges: string;
    Website?: string;
    EventPicture?: StrapiImage[];
    SeatMap?: StrapiImage[];
};

export default function EventDetailPage() {
    const path = usePathname();
    const id = path.split("/").pop() || "";

    const searchParams = useSearchParams();
    const locale = (searchParams.get("locale") as "en" | "de") || "en";


    const t = {
        en: {
            back: "← Back to events",
            starts: "Starts:",
            ends: "Ends:",
            website: "Website:",
            type: "Type:",
            capacity: "Capacity:",
            language: "Language:",
            visit: "Visit Official Site",
            notFound: "Event not found.",
            loadError: "Couldn't load event.",
            eventDetails: "Event Details",
            seatMap: "Seat Map",
        },
        de: {
            back: "← Zurück zur Übersicht",
            starts: "Beginn:",
            ends: "Ende:",
            website: "Webseite:",
            type: "Art:",
            capacity: "Kapazität:",
            language: "Sprache:",
            visit: "Offizielle Seite besuchen",
            notFound: "Veranstaltung nicht gefunden.",
            loadError: "Veranstaltung konnte nicht geladen werden.",
            eventDetails: "Veranstaltungsdetails",
            seatMap: "Sitzplan",
        },
    }[locale];

    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(
            `http://localhost:1337/api/events?populate=*&filters[id][$eq]=${id}&locale=${locale}`
        )
            .then((res) => {
                if (!res.ok) throw new Error(res.status.toString());
                return res.json();
            })
            .then((json) => {
                const data = json.data;
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error("NOT_FOUND");
                }
                setEvent(data[0]);
            })
            .catch((err) => {
                if (err.message === "NOT_FOUND") {
                    setError(t.notFound);
                } else {
                    console.error(err);
                    setError(t.loadError);
                }
            })
            .finally(() => setLoading(false));
    }, [id, locale, t.notFound, t.loadError]);


    if (loading) {
        return (
            <div className="event-detail-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading event details...</p>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="event-detail-container">
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <h2>{error}</h2>
                    <Link href={`/events?locale=${locale}`} className="back-link-error">
                        {t.back}
                    </Link>
                </div>
            </div>
        );
    }


    if (!event) {
        return (
            <div className="event-detail-container">
                <div className="error-state">
                    <div className="error-icon">📅</div>
                    <h2>{t.notFound}</h2>
                    <Link href={`/events?locale=${locale}`} className="back-link-error">
                        {t.back}
                    </Link>
                </div>
            </div>
        );
    }

    const bannerUrl = event.EventPicture?.[0]?.url ?? "/placeholder-event.jpg";
    const seatMapUrl = event.SeatMap?.[0]?.url;
    const start = new Date(event.StartOfTime).toLocaleString(locale);
    const end = new Date(event.EndTime).toLocaleString(locale);

    return (
        <div className="event-detail-container">

            <nav className="event-detail-nav">
                <Link href={`/events?locale=${locale}`} className="back-link">
                    <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t.back}
                </Link>
            </nav>


            <div className="event-detail-banner">
                <img
                    src={`http://localhost:1337${bannerUrl}`}
                    alt={event.NameOfTheEvent}
                    className="banner-image"
                />
                <div className="banner-overlay">
                    <div className="banner-content">
                        <h1 className="event-title">{event.NameOfTheEvent}</h1>
                        <div className="event-quick-info">
                            <div className="quick-info-item">
                                <span className="info-icon">📅</span>
                                <span>{start}</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="info-icon">🏷️</span>
                                <span>{event.EventType}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="event-detail-content">
                <div className="content-grid">

                    <div className="content-main">
                        <section className="event-description">
                            <h2 className="section-title">About This Event</h2>
                            <p className="description-text">{event.Description}</p>
                        </section>


                        {seatMapUrl && (
                            <section className="seat-map-section">
                                <h2 className="section-title">{t.seatMap}</h2>
                                <div className="seat-map-container">
                                    <img
                                        src={`http://localhost:1337${seatMapUrl}`}
                                        alt={t.seatMap}
                                        className="seat-map-image"
                                    />
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="content-sidebar">
                        <div className="event-details-card">
                            <h2 className="details-title">{t.eventDetails}</h2>

                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-icon">🕐</div>
                                    <div className="detail-content">
                                        <h3>{t.starts}</h3>
                                        <p>{start}</p>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <div className="detail-icon">🕐</div>
                                    <div className="detail-content">
                                        <h3>{t.ends}</h3>
                                        <p>{end}</p>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <div className="detail-icon">🏷️</div>
                                    <div className="detail-content">
                                        <h3>{t.type}</h3>
                                        <p>{event.EventType}</p>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <div className="detail-icon">👥</div>
                                    <div className="detail-content">
                                        <h3>{t.capacity}</h3>
                                        <p>{event.MaxCap}</p>
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <div className="detail-icon">🗣️</div>
                                    <div className="detail-content">
                                        <h3>{t.language}</h3>
                                        <p>{event.Langauges}</p>
                                    </div>
                                </div>

                                {event.Website && (
                                    <div className="detail-item">
                                        <div className="detail-icon">🌐</div>
                                        <div className="detail-content">
                                            <h3>{t.website}</h3>
                                            <a
                                                href={event.Website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="website-link"
                                            >
                                                Visit Site
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {event.Website && (
                                <div className="cta-section">
                                    <a
                                        href={event.Website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cta-button"
                                    >
                                        <span>{t.visit}</span>
                                        <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}