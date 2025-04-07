// App.js
import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';

const db = new Dexie('MeetingManagerDB');
db.version(1).stores({
  hosts: '++id, fullName, email',
  participants: '++id, fullName, email',
  meetings: '++id, name, location, date, hostIds, participantIds',
  responses: '++id, meetingId, participantId, responseText'
});

const App = () => {
  const [hosts, setHosts] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setHosts(await db.hosts.toArray());
      setParticipants(await db.participants.toArray());
      setMeetings(await db.meetings.toArray());
    };
    fetchData();
  }, []);

  const refresh = async () => {
    setHosts(await db.hosts.toArray());
    setParticipants(await db.participants.toArray());
    setMeetings(await db.meetings.toArray());
  };

  const handleAdd = async (type) => {
    const name = prompt(`Enter ${type} full name:`);
    const email = prompt(`Enter ${type} email:`);
    if (name && email) {
      await db[type].add({ fullName: name, email });
      refresh();
    }
  };

  const handleEdit = async (type, id) => {
    const item = await db[type].get(id);
    const fullName = prompt(`Edit name:`, item.fullName);
    const email = prompt(`Edit email:`, item.email);
    await db[type].update(id, { fullName, email });
    refresh();
  };

  const handleDelete = async (type, id) => {
    await db[type].delete(id);
    refresh();
  };

  const handleMeeting = async () => {
    const name = prompt("Meeting name:");
    const location = prompt("Location:");
    const date = prompt("Date (YYYY-MM-DD):");
    const hostIds = prompt("Host IDs (comma separated):").split(',').map(Number);
    const participantIds = prompt("Participant IDs (comma separated):").split(',').map(Number);
    await db.meetings.add({ name, location, date, hostIds, participantIds });
    refresh();
  };

  const handleEditMeeting = async (id) => {
    const m = await db.meetings.get(id);
    const name = prompt("Edit name:", m.name);
    const location = prompt("Edit location:", m.location);
    const date = prompt("Edit date:", m.date);
    const hostIds = prompt("Edit host IDs:", m.hostIds.join(',')).split(',').map(Number);
    const participantIds = prompt("Edit participant IDs:", m.participantIds.join(',')).split(',').map(Number);
    await db.meetings.update(id, { name, location, date, hostIds, participantIds });
    refresh();
  };

  const handleDeleteMeeting = async (id) => {
    await db.meetings.delete(id);
    refresh();
  };

  const handleResponse = async (meetingId) => {
    const participantId = parseInt(prompt("Your participant ID:"));
    const responseText = prompt("Your response:");
    await db.responses.add({ meetingId, participantId, responseText });
    alert("Response recorded.");
  };

  const viewResponses = async (meetingId) => {
    const responses = await db.responses.where('meetingId').equals(meetingId).toArray();
    alert(responses.map(r => `Participant ${r.participantId}: ${r.responseText}`).join('\n'));
  };

  return (
    <div className="container">
      <h1>Meeting Manager</h1>

      <h2>Hosts</h2>
      <button onClick={() => handleAdd('hosts')}>Add Host</button>
      <ul>
        {hosts.map(h => (
          <li key={h.id}>{h.fullName} ({h.email})
            <button onClick={() => handleEdit('hosts', h.id)}>Edit</button>
            <button className="delete" onClick={() => handleDelete('hosts', h.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Participants</h2>
      <button onClick={() => handleAdd('participants')}>Add Participant</button>
      <ul>
        {participants.map(p => (
          <li key={p.id}>{p.fullName} ({p.email})
            <button onClick={() => handleEdit('participants', p.id)}>Edit</button>
            <button className="delete" onClick={() => handleDelete('participants', p.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Meetings</h2>
      <button onClick={handleMeeting}>Create Meeting</button>
      <ul>
        {meetings.map(m => (
          <li key={m.id}>
            {m.name} @ {m.location} ({m.date})<br />
            Hosts: {m.hostIds.join(', ')} | Participants: {m.participantIds.join(', ')}<br />
            <button onClick={() => handleEditMeeting(m.id)}>Edit</button>
            <button className="delete" onClick={() => handleDeleteMeeting(m.id)}>Delete</button>
            <button onClick={() => handleResponse(m.id)}>Respond</button>
            <button onClick={() => viewResponses(m.id)}>View Responses</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
