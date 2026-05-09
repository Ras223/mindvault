package com.example.mindvault

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.mindvault.db.ChatDatabase
import com.example.mindvault.ui.ChatScreen
import com.example.mindvault.ui.ChatViewModel
import com.example.mindvault.ui.ChatViewModelFactory
import com.example.mindvault.ui.theme.MindVaultTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Inisiasi database dan DAO
        val database = ChatDatabase.getDatabase(this)
        val chatDao = database.chatDao()
        
        // Inisiasi ViewModel dengan Factory
        val viewModel: ChatViewModel by viewModels {
            ChatViewModelFactory(chatDao)
        }

        setContent {
            MindVaultTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    ChatScreen(viewModel = viewModel)
                }
            }
        }
    }
}
