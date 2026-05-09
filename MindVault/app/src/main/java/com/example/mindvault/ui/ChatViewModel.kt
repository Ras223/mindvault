package com.example.mindvault.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.mindvault.db.ChatDao
import com.example.mindvault.db.ChatMessage
import com.example.mindvault.network.ChatRequest
import com.example.mindvault.network.IngestRequest
import com.example.mindvault.network.RetrofitClient
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ChatViewModel(private val chatDao: ChatDao) : ViewModel() {

    val messages: StateFlow<List<ChatMessage>> = chatDao.getAllMessages()
        .stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    fun sendMessage(query: String) {
        if (query.isBlank()) return

        // 1. Tambahkan pesan user ke Room
        viewModelScope.launch {
            chatDao.insertMessage(ChatMessage(content = query, isFromUser = true))
        }

        // Cek jika ini adalah perintah Ingest (dimulai dengan "/ingest ")
        if (query.startsWith("/ingest ")) {
            val contentToIngest = query.removePrefix("/ingest ").trim()
            val isUrl = contentToIngest.startsWith("http")
            val type = if (isUrl) "url" else "text"
            
            viewModelScope.launch {
                try {
                    val response = RetrofitClient.api.ingestContent(IngestRequest(content = contentToIngest, type = type))
                    val botReply = if (response.success) {
                        "✅ Berhasil menyimpan dokumen/link ke Second Brain!"
                    } else {
                        "❌ Gagal: ${response.error ?: response.message}"
                    }
                    chatDao.insertMessage(ChatMessage(content = botReply, isFromUser = false))
                } catch (e: Exception) {
                    chatDao.insertMessage(ChatMessage(content = "❌ Error koneksi ke server: ${e.message}", isFromUser = false))
                }
            }
            return
        }

        // 2. Jika bukan ingest, lakukan proses RAG Chat
        viewModelScope.launch {
            try {
                val response = RetrofitClient.api.askQuestion(ChatRequest(query))
                val botReply = response.answer ?: response.error ?: "Tidak ada jawaban dari server."
                
                // Tambahkan referensi sumber jika ada
                val replyWithSources = if (!response.sources.isNullOrEmpty()) {
                    "$botReply\n\nSumber:\n" + response.sources.joinToString("\n") { "- $it" }
                } else {
                    botReply
                }

                chatDao.insertMessage(ChatMessage(content = replyWithSources, isFromUser = false))
            } catch (e: Exception) {
                chatDao.insertMessage(ChatMessage(content = "❌ Error koneksi ke server: ${e.message}", isFromUser = false))
            }
        }
    }
}
