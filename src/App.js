import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';

// Create a database instance
const db = new Dexie('MeetingManagerDB');

// Define the database schema
db.version(1).stores({
    hosts: '++id, fullName, email',
    meetings: '++id, name, location, date',
    participants: '++id, fullName, email',
});

// Define database operations as functions
const addHost = async (fullName, email) => {
    return await db.hosts.add({ fullName, email });
};

const editHost = async (id, fullName, email) => {
    return await db.hosts.update(id, { fullName, email });
};

const deleteHost = async (id) => {
    return await db.hosts.delete(id);
};

const addMeeting = async (name, location, date) => {
    return await db.meetings.add({ name, location, date });
};

const editMeeting = async (id, name, location, date) => {
    return await db.meetings.update(id, { name, location, date });
};

const deleteMeeting = async (id) => {
    return await db.meetings.delete(id);
};

const addParticipant = async (fullName, email) => {
    return await db.participants.add({ fullName, email });
};

const editParticipant = async (id, fullName, email) => {
    return await db.participants.update(id, { fullName, email });
};

const deleteParticipant = async (id) => {
    return await db.participants.delete(id);
};

const App = () => {
    const [hosts, setHosts] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const allHosts = await db.hosts.toArray();
            const allMeetings = await db.meetings.toArray();
            const allParticipants = await db.participants.toArray();
            setHosts(allHosts);
            setMeetings(allMeetings);
            setParticipants(allParticipants);
        };

        fetchData();
    }, []);

    const handleAddHost = async () => {
        const fullName = prompt("Enter host's full name:");
        const email = prompt("Enter host's email:");
        if (fullName && email) {
            await addHost(fullName, email);
            const allHosts = await db.hosts.toArray();
            setHosts(allHosts);
        }
    };

    const handleEditHost = async (id) => {
        const host = hosts.find(h => h.id === id);
        const fullName = prompt("Enter new host's full name:", host.fullName);
        const email = prompt("Enter new host's email:", host.email);
        if (fullName && email) {
            await editHost(id, fullName, email);
            const allHosts = await db.hosts.toArray();
            setHosts(allHosts);
        }
    };

    const handleDeleteHost = async (id) => {
        await deleteHost(id);
        const allHosts = await db.hosts.toArray();
        setHosts(allHosts);
    };

    return (
        <div>
            <h1>Meeting Manager</h1>
            <h2>Hosts</h2>
            <button onClick={handleAddHost}>Add Host</button>
            <ul>
                {hosts.map(host => (
                    <li key={host.id}>
                        {host.fullName} - {host.email}
                        <button onClick={() => handleEditHost(host.id)}>Edit</button>
                        <button onClick={() => handleDeleteHost(host.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {/* Similar sections for Meetings and Participants can be added here */}
        </div>
    );
};

export default App;